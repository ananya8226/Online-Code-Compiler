const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid'); // uuid package provides unique ids. It has various versions. We are using v4 and the function v4 is renamed to 'uuid' for further use in code.

const dirCodes = path.join(__dirname, "codes"); // dirname gives the path of folder in which generateFile.js exists.

if (!fs.existsSync(dirCodes)) // if dirCodes dorsn't exists make dirCodes in synchronous fashion.
{
    fs.mkdirSync(dirCodes, { recursive: true });
}

// async function bcoz we need to go step by step synchronously
const generateFile = async (format, content) => {
    const jobId = uuid();
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodes, filename);
    await fs.writeFileSync(filepath, content); //generate file and write content into that file
    return filepath;
};

module.exports = {
    generateFile,
};