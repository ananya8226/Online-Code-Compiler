const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const Job = require("./models/Job");

// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/compilerapp');
//     // mongoose.connection.on('connected', () => console.log('Connected'));
//     // mongoose.connection.on('error', () => console.log('Connection failed with - ', err));
// }

mongoose.connect("mongodb://127.0.0.1:27017/compilerApp");

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.get('/', (req,res) => {
//    return res.json({hello: "world"});
// });

// to implement polling, we need to have separate endpoint at which we can query that what is the status of the jobId that we have received.
app.get('/status', async(req,res) => {
    const jobId = req.query.id;
    console.log("status requested", jobId);
    if(jobId == undefined)
    {
        return res.status(400).json({success: false, error: "Missing id query param"});
    }
    // console.log(jobId);
    try{
        const job = await Job.findById(jobId);
        if(job == undefined)
        return res.status(404).json({success: false, error: "invalid job id"});  // 404 -> resource not found
    
        return res.status(200).json({success: true, job});
    } catch(err) {
        return res.status(400).json({success:false, error: JSON.stringify(err)});
    }
 });

//post method to define a route '/run' to run file and specify parameters
app.post("/run", async(req, res) => {
    // const language=req.body.language;
    // const code=req.body.code;

    const { language = "cpp", code } = req.body; //ES6 format -> use cpp as default language
    console.log(language, code.length);
    if(code === undefined)
    {
        return res.status(400).json({success: false, error: "Empty code body!"}); //status 400 -> bad request
    }

    let job;

    try {
    //need to generate a cpp file with content from request
    const filepath = await generateFile(language, code);

    job = await new Job({language, filepath}).save(); // creating new job object.
    const jobId = job["_id"];
    console.log(job);

    res.status(201).json({success: true, jobId}); // HTTP code 201 request has succeeded and has led to the creation of the resource. 

    //we need to run the file and send the response
    let output;
    
    job["startedAt"]= new Date();
    if(language === "cpp") {
        output = await executeCpp(filepath);
    }
    else{
        output = await executePy(filepath);
    }

    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();

    console.log(job);

    //return res.json({filepath, output});   
    //body contains actual language and code that will be sent 
    //from browser. It will be sent as a request.
    } catch (err) {
        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(err);

        await job.save(job);
       console.log(err);
       // res.status(500).json({err});
    }
});

// app runs on http://localhost:5000/
app.listen(5000, () => {
    console.log("Listening on port 5000");
});
