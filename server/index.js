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

var pythonEnvPath = "python";
// readline.question(`What is the path of your Python Virtual Environment Bin containing MetaKit? e.g. /usr/bin/python3\n`, answer => {
//     pythonEnvPath = answer;
//     console.log(`Set Python and Env as ${pythonEnvPath}!`);
//     readline.close();
// });

// Path of ranking model prediction file
const path = require("path");
var predictPath = "main.py";
var workingFolder = ".." + path.sep + "papers";
// const os = require("os");
// if (os.platform() == "win32") {
//     predictPath = "test.py";
// }

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
let jsonScholar;
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

// https://medium.com/@darshankhandelwal12/how-to-scrape-google-organic-search-results-with-node-js-d3abe0274f40
const selectRandom = () => {
    const userAgents =  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",     "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"];
    var randomNumber = Math.floor(Math.random() * userAgents.length);     return userAgents[randomNumber];     
    }       

function google_crawler_sync(selection){
    // Web Crawler based on the tutorial for Google Search
    // https://medium.com/@darshankhandelwal12/how-to-scrape-google-organic-search-results-with-node-js-d3abe0274f40

    let user_agent = selectRandom();
    // Google Search
    var url = 'https://www.google.com/search?q=' + selection;
    let localResult = "";
    var html = request('GET', url, {
        headers: {
            'user-agent': `${user_agent}`,
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

function scholar_crawler_sync(selection){
    // Web Crawler based on the tutorial for Google Scholar
    // https://serpapi.com/blog/how-to-scrape-google-scholar-organic-results-with-node-js/

    let user_agent = selectRandom();
    // Google Scholar
    var url = 'https://scholar.google.com/scholar?q=' + selection;
    let localResult = "";
    var html = request('GET', url, {
        headers: {
            'user-agent': `${user_agent}`,
            },
        }).getBody("utf8");

    let $ = cheerio.load(html);

    const organicResults = Array.from($(".gs_r.gs_scl")).map((el) => {
        return {
        title: $(el).find(".gs_rt").text().trim(),
        link: $(el).find(".gs_rt a").attr("href") || "link not available",
        publication_info: $(el).find(".gs_a").text().trim(),
        snippet: $(el).find(".gs_rs").text().trim().replace("\n", "")
        };
    });
    jsonScholar = organicResults;

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
    // https://nodejs.org/en/knowledge/HTTP/clients/how-to-create-a-HTTP-request/
    var body = '';

    //another chunk of data has been received, so append it to `str`
    req.on('data', function (chunk) {
        body += chunk;
    });
    //the whole response has been received, so we just print it out here
    req.on('end', function () {
        try{
            let jsonRequest = JSON.parse(body);
            console.log("Selection: " + jsonRequest["selection"]);
            let selection = jsonRequest["selection"];
            // body = Buffer.concat(body + ["TEST: Hi there."]).toString();
            // console.log(body);
            // parser json, using the above code for the request body if it is json
            // const jsonBody = JSON.parse(body.toString());

            // Test Selection Word
            // body = ["machine learning"];

            // Node.js offical doc for child process: https://nodejs.org/api/child_process.html
            const { spawnSync } = require('node:child_process');
            const predict = spawnSync(`${pythonEnvPath}`, [`${predictPath}`, `${selection}`], 
                                        {encoding: 'utf-8', cwd: `${workingFolder}`});
            const output = predict.stdout;
            // console.log(output);
            jsonChild = JSON.parse(output); 
            
            
            // predict.on('close', (code) => {
            //     console.log(`child process exited with code ${code}`);
            //   });

            // Wiki
            // let test_selection = "machine learning";
            // wiki_crawler_sync(selection);
            
            // Google Search
            google_crawler_sync(selection);
            
            // Google Scholar
            scholar_crawler_sync(selection);

            // create json object with the results from Python with trained ranking models
            var jsonData = {
                selection: selection,
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
                jsonScholar,
                // wikiLink:  wikiUrl,
                // wikiResult: wikiResult,
                googleResult: jsonGoogle,
            };

            const jsonContent = JSON.stringify(jsonData);
            
            // console.log(jsonData)
            // successful status and send the json object to the Chrome Extension
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(jsonContent);

            // console.log(jsonContent);
        } catch (error) {
            console.log("Error!");
            console.log(error.message.split('\n')[0]);

            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');

            let jsonRequest = JSON.parse(body);
            let selection = jsonRequest["selection"];

            var jsonData = {
                selection: selection,
                relevantPapers: null,
                scholarResults: null,
                googleResult: null,
                error: 1,
                errorMessage: error.message.split('\n')[0]
            };
            const jsonContent = JSON.stringify(jsonData);
            res.end(jsonContent);
        }
    });
});

// start the web server
server.listen(port, hostname, () => {
    // console.log(`Sever running at http://${hostname}:${port}/`);
});
