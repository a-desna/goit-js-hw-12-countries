'use strict';
import countriesService from './services-api/fetchCountries';
import countryItemTemlate from './templates/country-item.hbs';
import countryItemsListTemlate from './templates/country-list-items.hbs';
import { notice, success, error } from './pnotify';

const debounce = require('lodash.debounce');

const refs = {
  searchForm: document.querySelector('#search-form'),
  countryList: document.querySelector('#countries-list'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(searchFormInputHandler, 500),
);

function searchFormInputHandler(e) {
  e.preventDefault();
  const form = e.target;
  const inputValue = form.value;

  if (inputValue === '') {
    clearList();
    return;
  }
  clearList();

  countriesService
    .fetchCountries(inputValue)
    .then(countries => {
      if (countries.length >= 2 && countries.length <= 10) {
        insertCountrytListItems(countries);

        notice({
          text: 'Please specify your request!',
        });
      } else if (countries.length === 1) {
        insertCountrytItem(countries);
        form.value = '';

        success({
          text: 'Information on request found!',
        });
      } else {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      }
    })
    .catch(error => {
      console.warn(error);
    });
}

function insertCountrytListItems(items) {
  const markupCountriesList = countryItemsListTemlate(items);
  refs.countryList.insertAdjacentHTML('beforeend', markupCountriesList);
}

function insertCountrytItem(item) {
  const markupCountry = countryItemTemlate(item);
  refs.countryList.insertAdjacentHTML('beforeend', markupCountry);
}

function clearList() {
  refs.countryList.innerHTML = '';
}
