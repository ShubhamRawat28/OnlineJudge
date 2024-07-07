const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath
        , { recursive: true });
}

const executePython = (filePath, inputPath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const filename = `${jobId}.py`;
    const outPath = path.join(outputPath, filename);

    return new Promise((resolve,reject) => {
        exec(`python ${filePath} < ${inputPath}`, (error, stdout, stderr) => {
            if(error){
                reject(error);
            }
            if(stderr){
                reject(stderr);
            }
            resolve(stdout);
        });
    })
}

module.exports = { executePython };