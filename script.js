'use strict';

document.addEventListener('DOMContentLoaded', () => {

    
    const formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = document.querySelector('.input__cities-from'),
        inputCitiesTo = document.querySelector('.input__cities-to'),
        dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
        dropdownСitiesFrom = document.querySelector('.dropdown__cities-from'),
        inputDateDepart = document.querySelector('.input__date-depart');
        
    const city = ['Москва', 'Санкт-Петербург', 'Минск','Караганда',
    'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск',
    'Екатеринбург', 'Одесса', 'Ухань', 'Шымкен', 'Нижний Новгорог',
    'Калининград', 'Вроцлав', 'Ростов-на-дону'];

    const showCity = (input, list) => {
        list.textContent = '';

        if (input.value !== '') {

            const filterCity = city.filter((item) => {
                const fixItem = item.toLowerCase();
                return fixItem.includes(input.value.toLowerCase());
            });

            filterCity.forEach((item) => {
                const li = document.createElement('li');
                    li.classList.add('dropdown__city');
                    li.textContent = item;
                    list.append(li);
            });
        }
    };

    inputCitiesFrom.addEventListener('input', () => {
        showCity(inputCitiesFrom, dropdownСitiesFrom);
    });

    dropdownСitiesFrom.addEventListener('click', (e) => {
        const target = e.target;
        console.log(target);
        if (target.tagName.toLowerCase() === 'li') {
            inputCitiesFrom.value = target.textContent;
            dropdownСitiesFrom.textContent = '';
        }
    });

});