import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;

const searchlnputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoBlockEl = document.querySelector('.country-info');
let countriesItemsEls = '';
let countryInfoEl = ''

searchlnputEl.addEventListener('input', debounce((event) => {
  if (!event.target.value.trim()) {
    clearCountrydata();
    return
  }
  fetchCountries(event.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        clearCountrydata();
        Notiflix.Notify.info("Too many matches found.Please enter a more specific name.")
      }
      else if (data.length > 1) {
        clearCountrydata();
        renderCountriesList(data);
      } else {
        clearCountrydata();
        renderCountryInfo(data[0])
      }
    })
    .catch(() => {
      clearCountrydata();
      Notiflix.Notify.failure("Oops, there is no country with that name")
    });
}, DEBOUNCE_DELAY));


const renderCountriesList = (countries) => {
  countriesItemsEls = countries
    .map(({ name, flags }) => `
      <li class="country-item">
        <img src="${flags.svg}"
          alt="${flags.alt}" 
          width="30px"
          height="20px" />
        <h2 class="country-item_name">${name.official}</h2>
      </li>`)
    .join("");

  countryListEl.innerHTML = countriesItemsEls;
};

const renderCountryInfo = (country) => {
  countryInfoEl = `<div class="country-info_title">
      <img src="${country.flags.svg}"
        alt="${country.flags.alt}" 
        width="5%"
        height="5%" />
      <h1 class="country-item_name">${country.name.official}</h1>
    </div>
    <ul class="country-info_list">
      <li class="country-item">
        <p class="info-captcha">Capital(s):</p>
        <p>${country.capital.join(', ')}</p>
      </li class="info-item">
      <li class="country-item">
        <p class="info-captcha">Population:</p>
        <p>${country.population}</p>
      </li class="info-item">
      <li class="country-item">
        <p class="info-captcha">Languages:</p>
        <p>${Object.values(country.languages).join(', ')}</p>
      </li>
    </ul>`

  countryInfoBlockEl.innerHTML = countryInfoEl;
};

const clearCountrydata = () => {
  countriesItemsEls = '';
  countryInfoEl = '';
  countryListEl.innerHTML = countriesItemsEls;
  countryInfoBlockEl.innerHTML = countryInfoEl
};

