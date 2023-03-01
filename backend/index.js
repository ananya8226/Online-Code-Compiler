const express = require('express');
const cors = require("cors");

const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req,res) => {
   return res.json({hello: "world"});
});

//post method to define a route '/run' to run file and specify parameters
app.post("/run", async(req, res) => {
    // const language=req.body.language;
    // const code=req.body.code;
   
    const { language="cpp", code } = req.body; //ES6 format -> use cpp as default language
    if(code === undefined)
    {
        return res.status(400).json({success: false, error: "Empty code body!"}); //status 400 -> bad request
    }
    try {
    //need to generate a cpp file with content from request
    const filepath = await generateFile(language, code);
    //we need to run the file and send the response
    const output = await executeCpp(filepath);
        return res.json({filepath, output});  
    //body contains actual language and code that will be sent 
    //from browser. It will be sent as a request.
    } catch (err) {
        res.status(500).json({err});
    }
});

// app runs on http://localhost:5000/
app.listen(5000, () => {
    console.log("Listening on port 5000");
});


