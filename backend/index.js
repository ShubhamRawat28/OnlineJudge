const express = require("express");
const User = require("./models/Users");
const Problem = require("./models/Problems");
const connectDB = require("./database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const config = require("config");
const bodyParser = require("body-parser");
const { createFile } = require("./createFile");
const { executeCPP } = require("./executeCPP");
const { createInputFile } = require("./createInputFile");
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const port = 8000;

connectDB();

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ msg: "No Authorization header, authorization denied" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Malformed token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decodedToken = jwt.decode(token, { complete: true });
        console.log("Decoded token:", decodedToken);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded payload:", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

app.get("/user", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});


const admin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Admin resource. Access denied." });
    }
    next();
};


app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password, role = "user" } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
            role,
        });

        const token = jwt.sign(
            {
                id: user._id,
                email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        user.token = token;
        user.password = undefined;

        res.status(201).json({
            message: "You have successfully registered",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        user.token = token;
        user.password = undefined;
        res.status(200).json({
            message: "You have successfully logged in",
            user,
        });
    } catch (error) {
        console.log(error);
        console.log("Server error");
        res.status(500).json({ error: "Server error" });
    }
});

// compiler related api's
// Run code endpoint
app.post('/run', auth, async (req, res) => {
    const { language = "cpp", code, input = "" } = req.body;
    console.log(language, code);

    if (code === undefined || code === "") {
        return res.status(400).json({ success: false, msg: "Please fill all the fields" });
    }

    try {
        const filePath = createFile(language, code);
        const inputPath = createInputFile(input)
        let output;
        if (language === "python") {
            output = await executePython(filePath, inputPath);
        } else if (language === "cpp") {
            output = await executeCPP(filePath, inputPath);
        } else if (language === "java") {
            output = await executeJava(filePath, inputPath);
        }
        console.log(output);
        res.status(200).json({ success: true, output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit code endpoint
app.post('/submit', auth, async (req, res) => {
    const { language = "cpp", code, problem } = req.body;
    console.log(language, code, problem.test_cases);

    if (code === undefined || code === "") {
        return res.status(400).json({ success: false, msg: "Please fill all the fields" });
    }

    try {
        const test_cases = problem.test_cases;
        let count = 0;
        console.log(test_cases.length);
        const filePath = createFile(language, code);
        for (let i = 0; i < test_cases.length; i++) {
            let inputPath = createInputFile(test_cases[i].input);
            let output = await executeCPP(filePath, inputPath);
            output = output.trim();
            if (output != test_cases[i].output) {
                console.log(output, test_cases[i].output);
                return res.status(200).json({ success: false, msg: "Test case failed", count: `${count}`, total: `${test_cases.length}` });
            }
            count += 1;
        }
        console.log('All test cases passed')
        res.status(200).json({ success: true, msg: "All test cases passed", count: `${count}`, total: `${test_cases.length}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add problem endpoint (only for admin)
app.post('/addproblem', auth, admin, async (req, res) => {
    try {
        const { statement, name, code, difficulty, test_cases } = req.body;
        if (!statement || !name || !code || !difficulty || !test_cases) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }
        const problem = await Problem.create({
            statement,
            name,
            code,
            difficulty,
            test_cases
        });
        res.status(201).json({ msg: "Problem added successfully", problem });
    } catch (error) {
        res.status500().json({ error: "Server error" });
    }
});

// Edit problem endpoint (only for admin)
app.post('/editproblem', auth, admin, async (req, res) => {
    try {
        const { statement, name, code, difficulty, test_cases } = req.body;
        if (!statement || !name || !code || !difficulty || !test_cases) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }
        const problem = await Problem.findOneAndUpdate({ name }, {
            statement,
            name,
            code,
            difficulty,
            test_cases
        });
        res.status(201).json({ msg: "Problem updated successfully", problem });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get all problems endpoint
app.get('/problems', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json({ problems });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get problem by ID endpoint
app.get('/problems/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
