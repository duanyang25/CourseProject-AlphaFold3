// Based on the GitHub repo shared by TAs
// https://dev.to/debosthefirst/how-to-build-a-chrome-extension-that-makes-api-calls-1g04
// https://github.com/onedebos/covtension
import axios from "axios";
const api = "https://covid19.mathdro.id/api/countries";

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
// grab the key words
const textbox = document.querySelector(".textbox-input");

// declare a method to search by key words
const searchForKeyWords = async textboxValue => {
  loading.style.display = "block";
  errors.textContent = "";

  try {
    const stringResponse = await axios({
      method: 'post',
      url: `${server}`,
      data: {
        selection: textboxValue
      },
      responseType:'json',
    });
    let jsonResponse = stringResponse.data;

    selection.textContent = jsonResponse["selection"];
    papers.textContent = jsonResponse["relevantPapers"];
    wiki.textContent = jsonResponse["wikiResult"];

    scholar.textContent = jsonResponse["scholarResults"];
    google.textContent = jsonResponse["googleResult"];

    loading.style.display = "none";
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
  searchForKeyWords(textbox.value);
  console.log(textbox.value);
};

form.addEventListener("submit", e => handleSubmit(e));
