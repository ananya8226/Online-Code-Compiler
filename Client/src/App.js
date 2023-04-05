import axios from 'axios';
import './App.css';
import React, {useState} from 'react';

function App() {

  // to save the content entered in textarea we use useState provided by react.
 
  const [code, setCode] = useState("");  // code variable stores/saves the content of textarea and setCode is used to change the content of textarea.
  const [language, setLanguage] = useState("cpp"); // cpp deafult value
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  
  const handleSubmit = async() => {
    const payload = {
      language,
      code,  // (code: code), is same as code in ES6
    };

    //console.log(code); // we will send this code to backend and get response --> use axios
    //const output = await axios.post("http://localhost:5000/run", payload);
    try{
    setJobId("");
    setStatus("");
    setOutput("");
    const { data } = await axios.post("http://localhost:5000/run", payload); // we need to display this output so we extract output.data
    console.log(data);
    setJobId(data.output);
    let intervalId;

    intervalId = setInterval(async() => {

    const { data: dataRes } = await axios.get(
    "http://localhost:5000/status",
    { params: { id: data.jobId } }
    );

    const {success, job, error} = dataRes; // restructuring datares, it will be success, job or error out of datares.
    console.log(dataRes);
    
    if(success) {
       const {status: jobStatus, output: jobOutput} = job;
       setStatus(jobStatus);
       if(jobStatus === "pending")
       {
        return;
       } 
       setOutput(jobOutput);
       clearInterval(intervalId);
    }
    else{
      setStatus("Error: Please try!");
      console.log(error);
      clearInterval(intervalId);
      setOutput(error);
    }
    
    console.log(dataRes);
    },1000);


    } catch ({response}) {
      if(response){
        // console.log(response.data.err.stderr);
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      }
      else{
        setOutput("Error connecting to server!");
      }
    }
  };
  
  return (
    <div className="App">
     <h1>Online Code Compiler</h1>
     <div>
      <label>Language: </label>
     <select 
       value={language}
       onChange={ (e) => {
         setLanguage(e.target.value);
         console.log(e.target.value);
       }}
     >
      <option value="cpp">C++</option>
      <option value="py">Python</option>
     </select>
     </div>
     <br/>
     <textarea 
      rows="20" 
      cols="75" 
      value={code} 
      onChange= {(e) => { 
         //whenever this code in textarea changes, e (event object) is recieved as parameter and e.target.value will be text content of textarea.
        setCode(e.target.value);
      }}
     ></textarea>
     <br/>
     <button onClick={handleSubmit}>Submit</button>
     <p>{ status }</p>
     <p>{ jobId &&  `JobID: ${jobId}`}</p>
     <p>{ output }</p>
    </div>
  );
}

export default App;