// Based on the GitHub repo shared by TAs
// https://dev.to/debosthefirst/how-to-build-a-chrome-extension-that-makes-api-calls-1g04
// https://github.com/onedebos/covtension
const request = require('sync-request');

const server = "http://127.0.0.1:4100/";

const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");

const selection = document.querySelector(".selection");
const papers = document.querySelector(".papers");
const wiki = document.querySelector(".wiki");
const scholar = document.querySelector(".scholar");
const google = document.querySelector(".google");

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";

// grab the form
const form = document.querySelector(".form-data");
// grab the country name
const textBoxInput = document.querySelector(".key-word");

// declare a method to search by Key Words
const searchForKeyWord = async keywords => {
  loading.style.display = "block";
  errors.textContent = "";

  try {
    var jsonData = { selection: keywords,}

    // var response = request('GET', url, {
    //   body: JSON.stringify(jsonData),
    //   json: true
    // }).getBody("utf8");
    const stringResponse = await axios.get(`${server}`);
    let response = JSON.parse(stringResponse);
    
    loading.style.display = "none";

    selection.textContent = response["selection"];
    papers.textContent = response["relevantPapers"];
    wiki.textContent = response["wikiResult"];

    scholar.textContent = response["scholarResults"];
    google.textContent = response["googleResult"];

    results.style.display = "block";
  } catch (error) {
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "Error!";
  }
};

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  searchForKeyWord(textBoxInput.value);
  console.log(textBoxInput.value);
};

form.addEventListener("submit", e => handleSubmit(e));
