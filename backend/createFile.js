const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCode = path.join(__dirname, "code");
if(!fs.existsSync(dirCode)){
    fs.mkdirSync(dirCode, { recursive: true });
}


const createFile = (language, code) => {
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filePath = path.join(dirCode, filename);
    fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = { createFile };
