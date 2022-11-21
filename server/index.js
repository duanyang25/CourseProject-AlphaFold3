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

// Web Crawler
const rp = require('request-promise');
const request = require('sync-request');
const cheerio = require("cheerio");
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
let wikiResult = "";
let wikiUrl = "";

let jsonGoogle;

function getWikiResult (result, url) {
    wikiResult = result;
    wikiUrl = url.replace(" ", "_");
}

// Async, did not work very well, result in a delay of data extraction
async function wiki_crawler(selection, callback){
    // Web Crawler based on Request Promise
    // https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
    // https://github.com/request/request-promise

    // Wiki
    var url = 'https://en.wikipedia.org/wiki/' + selection;
    let localResult = "";
    await rp(url)
        .then(function(html){
            //success!
            // console.log(html);

            // https://stackoverflow.com/questions/56213117/how-to-silent-all-the-warning-messages-of-xml-dom-in-node-js
            var doc = new dom({
                locator: {},
                errorHandler: { warning: function (w) { }, 
                error: function (e) { }, 
                fatalError: function (e) { console.error(e) } }
            }).parseFromString(html);

            var nodes = xpath.select('.//*[@id="mw-content-text"]/div[1]/p[1]', doc); 

            // https://stackoverflow.com/questions/57822599/node-js-xpath-example
            nodes.forEach( (n, i) => {
                // console.log(n.textContent);
                localResult += n.textContent;
              });
            
        })
        .catch(function(err){
            //handle error
        });
    return callback(localResult, url);
}


function wiki_crawler_sync(selection){
    // Web Crawler based on Request Promise
    // https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
    // https://github.com/request/request-promise

    // Wiki
    var url = 'https://en.wikipedia.org/wiki/' + selection;
    let localResult = "";
    var html = request('GET', url, {
        headers: {
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
          },
        }).getBody("utf8");

    // Remove warning messages from result
    // https://stackoverflow.com/questions/56213117/how-to-silent-all-the-warning-messages-of-xml-dom-in-node-js
    var doc = new dom({
        locator: {},
        errorHandler: { warning: function (w) { }, 
        error: function (e) { }, 
        fatalError: function (e) { console.error(e) } }
    }).parseFromString(html);

    var nodes = xpath.select('.//*[@id="mw-content-text"]/div[1]/p[1]', doc); 

    // Concatenate texts from result
    // https://stackoverflow.com/questions/57822599/node-js-xpath-example
    
    nodes.forEach( (n, i) => {
        // console.log(n.textContent);
        localResult += n.textContent;
      });
    
    wikiResult = localResult;
    wikiUrl = url.replace(" ", "_");
}


function google_crawler_sync(selection){
    // Web Crawler based on the tutorial for Google Search
    // https://medium.com/@darshankhandelwal12/how-to-scrape-google-organic-search-results-with-node-js-d3abe0274f40

    // Google Search
    var url = 'https://www.google.com/search?q=' + selection;
    let localResult = "";
    var html = request('GET', url, {
        headers: {
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
          },
        }).getBody("utf8");

    let $ = cheerio.load(html);

    let titles = [];
    let links = [];
    let snippets = [];

    $(".yuRUbf > a > h3").each((i, el) => {
        titles[i] = $(el).text();
    });
    $(".yuRUbf > a").each((i, el) => {
        links[i] = $(el).attr("href");
    });
    $(".g .VwiC3b ").each((i, el) => {
        snippets[i] = $(el).text();
    });

    const organicResults = [];

    for (let i = 0; i < titles.length; i++) {
        organicResults[i] = {
        title: titles[i],
        links: links[i],
        snippet: snippets[i],
        };
    }
    jsonGoogle = organicResults;
}


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

    // Test Selection Word
    // body = ["machine learning"];

    // Node.js offical doc for child process: https://nodejs.org/api/child_process.html
    const { spawnSync } = require('node:child_process');
    const predict = spawnSync(`${pythonEnvPath}`, [`${predictPath}`, `${body}`, "hi,12345"], 
                                {encoding: 'utf-8'});
    const output = predict.stdout;
    jsonChild = JSON.parse(output); 
      
    // predict.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);
    //   });

    // Wiki

    let test_selection = "machine learning";
    wiki_crawler_sync(test_selection);
    // Google API
    // https://serpapi.com/search-api
    google_crawler_sync(test_selection);

    // create json object with the results from Python with trained ranking models
    var jsonData = {
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
        wikiLink:  wikiUrl,
        wikiResult: wikiResult,
        googleResult: jsonGoogle,
    };

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
