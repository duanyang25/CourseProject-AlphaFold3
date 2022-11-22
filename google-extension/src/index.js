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


const cases = document.querySelector(".cases");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";
// grab the form
const form = document.querySelector(".form-data");
// grab the country name
const country = document.querySelector(".country-name");

// declare a method to search by country name
const searchForCountry = async countryName => {
  loading.style.display = "block";
  errors.textContent = "";

  try {
    let response = await axios.get(`${api}/${countryName}`);
    loading.style.display = "none";

    cases.textContent = response.data.confirmed.value;
    recovered.textContent = response.data.recovered.value;
    // deaths.textContent = response.data.deaths.value;

    const stringResponse = await axios({
      method: 'post',
      url: `${server}`,
      data: {
        selection: countryName
      },
      responseType:'json',
    });
    deaths.textContent = stringResponse["relevantPapers"];
    // loading.style.display = "none";

    // selection.textContent = response["selection"];
    // papers.textContent = response["relevantPapers"];
    // wiki.textContent = response["wikiResult"];

    // scholar.textContent = response["scholarResults"];
    // google.textContent = response["googleResult"];


    results.style.display = "block";
  } catch (error) {
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "We have no data for the country you have requested.";
  }
};

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  searchForCountry(country.value);
  console.log(country.value);
};

form.addEventListener("submit", e => handleSubmit(e));
