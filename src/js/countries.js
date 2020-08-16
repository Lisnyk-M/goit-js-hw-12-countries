
import itemsTemplate from '../templates/multipleCountries.hbs';
import singleCountryTemplate from '../templates/singleCountry.hbs';

import { alert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/core/dist/PNotify.css';
// import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';
import { notice, info, success, error } from '@pnotify/core';

defaultModules.set(PNotifyMobile, {});


import countriesService from './services/fetchCounries';
const debounce = require('lodash.debounce');

const refs = {
    articleList: document.querySelector('#article-list'),
    inputQuery: document.querySelector('input[name="query"]'),
    wrapBlock: document.querySelector('.countries-wrap'),
}

refs.inputQuery.addEventListener('input', debounce(function (event) {
    searchInputHandler(event);
}, 500));


console.log('input: ', refs.inputQuery);

function searchInputHandler(event) {
    countriesService(event.target.value)
        .then(countries => {
            console.log('resp countries:', countries, countries.length);
            if (countries.status == 404){
                const myInfo = info({
                    text: "По такому запросу країн не знайдено ",
                    delay: 3000
                });
            }
            refs.articleList.innerHTML = '';
            refs.wrapBlock.innerHTML = '';

            switch (true) {
                case countries.length <= 10 && countries.length > 2:
                    insertListItems(countries);
                    console.log('<10');
                    break;

                case countries.length > 10: {
                    const myerror = error({
                        text: "Знайдено забагато співпадань. Введіть будь-ласка більш специфічний запрос",
                        delay: 3000
                    });
                    break;
                }
                case countries.length == 1:
                    console.log('single country');
                    insertListItemsSingle(countries);
                    break;
                default: {

                }
            }
        }).catch(error => {
            console.log('error: ', error);
        })
}


function insertListItems(items) {
    const template = itemsTemplate(items);
    refs.articleList.insertAdjacentHTML('beforeend', template);
}

function insertListItemsSingle(items) {
    const template = singleCountryTemplate(items);
    refs.wrapBlock.insertAdjacentHTML('beforeend', template);

}


