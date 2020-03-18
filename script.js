'use strict';

document.addEventListener('DOMContentLoaded', () => {

    
    const formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = document.querySelector('.input__cities-from'),
        inputCitiesTo = document.querySelector('.input__cities-to'),
        dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
        dropdownСitiesFrom = document.querySelector('.dropdown__cities-from'),
        inputDateDepart = document.querySelector('.input__date-depart');
        
        // http://api.travelpayouts.com/data/ru/cities.json
    const citiesApi = 'dataBase/cities.json',
            proxy = 'https://cors-anywhere.herokuapp.com/',
            API_KEY = '34e51bc0013fd0bc3565d14409409b25',
            calendar = 'http://min-prices.aviasales.ru/calendar_preload';
    let city = [];
    // const city = ['Москва', 'Санкт-Петербург', 'Минск','Караганда',
    // 'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск',
    // 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкен', 'Нижний Новгорог',
    // 'Калининград', 'Вроцлав', 'Ростов-на-дону'];


    const getData = (url, callback) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) return;

            if (request.status === 200) {
                callback(request.response);
            } else {
                console.error(request.status);
            }
        });
        request.send();
    };
    

    const showCity = (input, list) => {
        list.textContent = '';

        if (input.value !== '') {

            const filterCity = city.filter((item) => {

                // if (item.name) {
                    const fixItem = item.name.toLowerCase();
                    return fixItem.includes(input.value.toLowerCase());                    
                // }
            });

            filterCity.forEach((item) => {
                const li = document.createElement('li');
                    li.classList.add('dropdown__city');
                    li.textContent = item.name;
                    list.append(li);
            });
        }
    };

    const selectCity = (event, input, list) => {
        const target = event.target;
        console.log(target);
        if (target.tagName.toLowerCase() === 'li') {
            input.value = target.textContent;
            list.textContent = '';
        }
    }

    inputCitiesFrom.addEventListener('input', () => {
        showCity(inputCitiesFrom, dropdownСitiesFrom);
    });
    inputCitiesTo.addEventListener('input', () => {
        showCity(inputCitiesTo, dropdownCitiesTo);
    });

    dropdownСitiesFrom.addEventListener('click', (event) => {
        selectCity(event, inputCitiesFrom, dropdownСitiesFrom);
    });
    dropdownCitiesTo.addEventListener('click', (event) => {
        selectCity(event, inputCitiesTo, dropdownCitiesTo);
    });



    // getData('https://jsonplaceholder.typicode.com/todos');
    // getData('https://jsonplaceholder.typicode.com/photos', (data => {
    //     console.log(data);
    // }));
    getData(citiesApi, (data => {
        city = JSON.parse(data).filter((item) => {
            return item.name;
        });
    }));
});