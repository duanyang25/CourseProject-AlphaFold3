// Sever setting
const http = require("http"); // Use HTTP protocol
const url = require("url"); // Handle GET request
const hostname = "127.0.0.1";
const port = 4100;
console.log(`Sever running at http://${hostname}:${port}/`);

// Node.js official doc for input: https://nodejs.dev/en/learn/accept-input-from-the-command-line-in-nodejs/
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

var pythonEnvPath;
readline.question(`What is the path of your Python Virtual Environment Bin containing MetaKit? e.g. /usr/bin/python3\n`, answer => {
    pythonEnvPath = answer;
    console.log(`Set Python and Env as ${pythonEnvPath}!`);
    readline.close();
});

// Path of ranking model prediction file
const predictPath = "./test.py";

// Parse Json
const bodyParser = require('body-parser'); 
// global variables scoped to the module
var jsonChild;
var links = [];

const server = http.createServer((req, res) => {
    // handle error
    // if (err) {
    //     res.statusCode = 500
    //     return res.end("Error")
    // }
    
    // Node.js official doc for extracting request:
    // https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
    // extract the body of request
    // assume plain text
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
    });
    // body = Buffer.concat(body + ["TEST: Hi there."]).toString();

    // parser json, using the above code for the request body if it is json
    // const jsonBody = JSON.parse(body.toString());

    // Node.js offical doc for child process: https://nodejs.org/api/child_process.html
    const { spawnSync } = require('node:child_process');
    const predict = spawnSync(`${pythonEnvPath}`, [`${predictPath}`, `${body}`, "hi,12345"], 
                                {encoding: 'utf-8'});
    const output = predict.stdout;
    jsonChild = JSON.parse(output); 
      
    // predict.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);
    //   });
    
    // create json object with the results from Python with trained ranking models
    const jsonData = {
        selection: body,
        relevantPapers:
        // [
        //     { "paperTitle":"Paper1", "abstract":"One algorithm1", "link":"https://acm.com/doi/12345" },
        //     { "paperTitle":"Paper2", "abstract":"One algorithm2", "link":"https://acm.com/doi/12345" },
        //     { "paperTitle":"Paper3", "abstract":"One algorithm3", "link":"https://acm.com/doi/12345" }
        // ],
        jsonChild["papers"],
        scholarResults:
        // [
        //     { "pageTitle":"Page1", "link":"https://google.com/scholar/12345" },
        //     { "pageTitle":"Page2", "link":"https://google.com/scholar/12345" },
        //     { "pageTitle":"Page3", "link":"https://google.com/scholar/12345" }
        // ],
        links,
    }
    const jsonContent = JSON.stringify(jsonData);

    // successful status and send the json object to the Chrome Extension
    res.statusCode = 200;
    res.setHeader("content-type", "application/json")
    res.end(jsonContent)

});

// start the web server
server.listen(port, hostname, () => {
    // console.log(`Sever running at http://${hostname}:${port}/`);
});
