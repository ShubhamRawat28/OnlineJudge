const express = require("express");
const User = require("./models/Users");
const Problem = require("./models/Problems");
const connectDB = require("./database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { createFile } = require("./createFile");
const { executeCPP } = require("./executeCPP");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8000;

connectDB();

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.post("/register", async (req, res) => {
    try {
        // get all the data from the body
		console.log(req.body);
        const { firstname, lastname, email, password } = req.body;
        console.log(firstname, lastname, email, password);

        // check the data is not empty
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ msg: "Please fill all the fields" });
        }

        // check if the user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exist" });
        }

        // encrypt the password
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        // insert the data in the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        // generate a token for the user and send it
        const token = jwt.sign(
            {
                id: user._id,
                email,
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
        res.status(500).json({ error: "Server error" });
    }
});

// compiler related api's
app.post('/run', async(req,res) => {
    const { language="cpp", code } = req.body;
    console.log(language, code);

    if(code === undefined || code === "") {
        return res.status(400).json({success: false, msg: "Please fill all the fields" });
    }

    try {
        const filePath = createFile(language, code);
        console.log(filePath);
        const output = await executeCPP(filePath);

        res.status(200).json({success: true, output});
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
})

app.get('/problems' , async(req,res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json({problems});
    }
    catch(error) {
        res.status(500).json({error: "Server error"});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
