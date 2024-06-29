const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, { recursive: true });
}


const executeCPP = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const filename = `${jobId}.exe`;
    console.log(filePath);
    console.log(filename);
    const outPath = path.join(outputPath, filename);

    return new Promise((resolve,reject) => {
        exec(`g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${filename}`, (error, stdout, stderr) => {
            if(error){
                reject(error);
            }
            if(stderr){
                reject(stderr);
            }
            resolve(stdout);
        });
    })
};

module.exports = { executeCPP };
