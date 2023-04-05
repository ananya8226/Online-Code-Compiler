const { exec } = require("child_process");
const path = require("path");
const fs=require("fs");
const { stderr } = require("process");

const outputPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outputPath)) //if output folder isn't present create one.
{
    fs.mkdirSync(outputPath, {recursive:true});
}

const executeCpp = (filepath) => {
    //extract jobid from filepath to create outputfile name.
    const jobId = path.basename(filepath).split(".")[0]; // to extract basename from filepath without ".cpp" extension.
    const outPath = path.join(outputPath, `${jobId}.exe`);

    // Promise ensures that we will either get a response or error after sometime so wait.
    return new Promise((resolve, reject) => {
      //exec takes in a shell command and runs it.
      exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`
      ,(error, stdout, stderr) => {
        // if(error) {
        //     reject({error, stderr});
        // }
        // if(stderr) {
        //     reject(stderr);
        // } 
        error && reject({error, stderr});  //shortform using ES6 
        stderr && reject(stderr); // if stderr==true then reject 
        resolve(stdout);
      });  
    });
}

module.exports = {
    executeCpp,
}

//g++ 180ed48e-8a69-47a2-b4ba-2e1a14391114.cpp; if($?) { .\a.exe } 
//if the first cmd runs then only the second cmd runs. (works as && for linux)