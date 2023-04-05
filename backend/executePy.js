const { exec } = require('child_process');
const { stderr } = require("process");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
      exec(`py ${filepath}`
      ,(error, stdout, stderr) => {
        error && reject({error, stderr});  //shortform using ES6 
        stderr && reject(stderr);  //if stderr==true then reject 
        resolve(stdout);
      }
      );  
    });
};

module.exports = {
    executePy,
}

// g++ 180ed48e-8a69-47a2-b4ba-2e1a14391114.cpp; if($?) { .\a.exe } 
// if the first cmd runs then only the second cmd runs. (works as && for linux)