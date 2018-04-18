let countriesArray = [];
let regionsArray = [];

document.addEventListener('DOMContentLoaded', () => {

  const url = 'https://restcountries.eu/rest/v2/all';
  // makeRequest(url, requestComplete);
  makeRequest(url, assignCountriesData);

});

const assignCountriesData = function() {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  const countries = JSON.parse(jsonString);
  countriesArray = countries;

  const button = document.querySelector('#displayButton');
  button.addEventListener('click', () => {
    populateList(countriesArray);
  });

  populateSelector(countriesArray);
  populateRegions();
  console.log(regionsArray);
}

const populateRegions = function(){
  countriesArray.forEach((country) =>{
    country.regionalBlocs.forEach(region => {
      if (!regionsArray.includes(region)){
        regionsArray.push(region);
      }
    })
  })

}

const populateRegionSelector = function(){
  const selector = document.querySelector('#choose-regions')
  regionsArray.forEach((region) => {
    createRegionSelection(selector, region);
  })
}

const createRegionSelection = function(parent, region){
  const option = document.createElement('option');
  option.value = region.name;
  option.textContent = region.name;
  parent.appendChild(option);
  parent.onchange=displayCountriesByRegion;
}

const displayCountriesByRegion = function(){
  const regionName = this.value;
  const countriesInRegionArray = countriesArray.filter((country)=>{
    let isAMatch = false;
    country.regionalBlocs.forEach((region) => {
      if (region.name === regionName){
        isAMatch = true;
      }
    })
    return isAMatch;
  })

  countriesInRegionArray.forEach(country => {
    createCountryHTML(country);
  })
}

//reusable and can be used with many apis
const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', callback);
}

const populateList = function(countries){
  // console.log(countries);
  const ul = document.querySelector('#country-list')

  countries.forEach((country) => {
    const li = document.createElement('li');
    li.textContent = country.name;
    ul.appendChild(li);
  });

}

const createCountrySelection = function(parent, country){
  // const option = new Option(country.name, country.name);
  const option = document.createElement('option');
  option.value = country.name;
  option.textContent = country.name;
  parent.appendChild(option);
  parent.onchange=displayDetails;
}

const populateSelector = function(countries){
  const selector = document.querySelector('#choose-countries')

  countries.forEach((country) => {
    createCountrySelection(selector, country);
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
  // if (this.status !== 200) return;
  // const jsonString = this.responseText;
  // console.dir(this);
  // const country = JSON.parse(jsonString)[0];
  // console.log(country);
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

// const requestComplete = function () {
//   // this refers to request obj
//   if (this.status !== 200) return;
//   const jsonString = this.responseText;
//   const countries = JSON.parse(jsonString);
//   // console.log(countries);
//   // const country = countries[0];
//   populateList(countries);
// }

// const onloadRequestComplete = function () {
//   // this refers to request obj
//   if (this.status !== 200) return;
//   const jsonString = this.responseText;
//   const countries = JSON.parse(jsonString);
//   // console.log(countries);
//   const country = countries[0];
//   populateSelector(countries);
// }

// const showInfo = function(){
//   const name = this.value;
//   console.log(name);
//   const url = `https://restcountries.eu/rest/v2/name/${name}`;
//   makeRequest(url, displayDetails);
// }
