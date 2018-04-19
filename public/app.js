let countriesArray = [];
let regionsArray = [];

document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  makeRequest(url, populateData);
});

const populateData = function() {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  countriesArray = JSON.parse(jsonString);

  const button = document.querySelector('#displayButton');
  button.addEventListener('click', () => {
    populateList();
  });

  populateCountrySelector();
  populateRegionsArray();
  populateRegionSelector();
}

const populateRegionsArray = function(){
  countriesArray.forEach((country) =>{
    if (!regionsArray.includes(country.region)){
      regionsArray.push(country.region);
    }
  });
}

const populateRegionSelector = function(){
  const selector = document.querySelector('#choose-regions')
  regionsArray.forEach((region) => {
    createRegionSelection(selector, region);
  });
}

const createRegionSelection = function(parent, region){
  const option = document.createElement('option');
  option.value = region;
  option.textContent = region;
  parent.appendChild(option);
  parent.onchange=displayCountriesByRegion;
}

const displayCountriesByRegion = function(){
  const region = this.value;
  const countriesInRegionArray = countriesArray.filter((country)=>{
    let isAMatch = false;
    if (country.region === region){
        isAMatch = true;
    }
    return isAMatch;
  });
  const ul = document.querySelector('#country-list')
  ul.innerHTML = '';
  countriesInRegionArray.forEach(country => {
    createCountryHTML(country);
  });
}

const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', callback);
}

const populateList = function(){
  const ul = document.querySelector('#country-list')
  ul.innerHTML = '';
  countriesArray.forEach((country) => {
    const li = document.createElement('li');
    li.textContent = country.name;
    ul.appendChild(li);
  });

}

const createCountryOptionInSelector = function(parent, country){
  const option = document.createElement('option');
  option.value = country.name;
  option.textContent = country.name;
  parent.appendChild(option);
  parent.onchange=displayDetails;
}

const populateCountrySelector = function(){
  const selector = document.querySelector('#choose-countries')
  countriesArray.forEach((country) => {
    createCountryOptionInSelector(selector, country);
  })
}

const displayDetails = function() {
  const countryName = this.value;
  let country;
  countriesArray.forEach(countryObject => {
    if (countryObject.name === countryName) {
      country = countryObject;
    }
  });
  const list = document.querySelector('#country-list');
  list.innerHTML = '';
  createCountryHTML(country);
  list.appendChild(document.createElement('hr'));
  findBorderCountries(country);
}

const findBorderCountries = function(currentCountry) {
  const borderCountries = currentCountry.borders;
  const borderCountryObjects = countriesArray.filter(country => {
    return borderCountries.includes(country.alpha3Code);
  });

  borderCountryObjects.forEach(country => {
    createCountryHTML(country);
  });
}

const createCountryHTML = function(country) {
  const ul = document.createElement('ul');
  const name = document.createElement('li');
  const population = document.createElement('li');
  const capitalCity = document.createElement('li');
  name.textContent = `name: ${country.name}`;
  population.textContent = `population: ${country.population}`;
  capitalCity.textContent = `capital city: ${country.capital}`;
  ul.appendChild(name);
  ul.appendChild(population);
  ul.appendChild(capitalCity);
  ul.appendChild(document.createElement('br'));
  const parent = document.querySelector('#country-list');
  parent.appendChild(ul);
}
