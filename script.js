'use strict';

document.addEventListener('DOMContentLoaded', () => {

		
		const formSearch = document.querySelector('.form-search'),
				inputCitiesFrom = document.querySelector('.input__cities-from'),
				inputCitiesTo = document.querySelector('.input__cities-to'),
				dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
				dropdownСitiesFrom = document.querySelector('.dropdown__cities-from'),
				inputDateDepart = document.querySelector('.input__date-depart');
				
				// http://api.travelpayouts.com/data/ru/cities.json
			 // http://min-prices.aviasales.ru/calendar_preload?origin_iata=MOV&destination_iata=VKT&depart_date=2020-05-25
			 // dataBase/cities.json
			 // http://min-prices.aviasales.ru/calendar_preload?origin=MOV&destination=VKT&depart_date=2020-05-25&one_way=true
			 // http://min-prices.aviasales.ru/calendar_preload
		const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
					citiesApiLocal = 'dataBase/cities.json',
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
								
										const fixItem = item.name.toLowerCase();
										return fixItem.includes(input.value.toLowerCase());                    
							
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
				if (target.tagName.toLowerCase() === 'li') {
						input.value = target.textContent;
						list.textContent = '';
				}
		};

		const renderCheapDay = (cheapTicket) => {
			console.log(cheapTicket);
		};

		const renderCheapYear = (cheapTickets) => {
			console.log(cheapTickets);
		};



		const renderCheap = (data, date) => {
				const cheapTicketYear = JSON.parse(data).best_prices;        
				const cheapTicketDay = cheapTicketYear.filter((item) => {
						return item.depart_date === date;
				});
				console.log(cheapTicketYear);
				console.log(cheapTicketDay);

		};

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
		formSearch.addEventListener('submit', (event) => {
				event.preventDefault();

				// const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
				// const cityTo = city.find((item) => inputCitiesTo.value === item.name);


				// const formData = {
				// 		from: cityFrom.code,
				// 		to: cityTo.code,
				// 		when: inputDateDepart.value,
				// }

				const formData = {
						from: city.find((item) => inputCitiesFrom.value === item.name).code,
						to: city.find((item) => inputCitiesTo.value === item.name).code,
						when: inputDateDepart.value,
				};
				
				const requestData = `?depart_date=${formData.when}&origin=${formData.when} \n
							&origin=${formData.from}&destination=${formData.to}&one_way=true`;

					const requestData2 = '?depart_date=' + formData.when +
						'&origin=' + formData.from +
						'&destination=' + formData.to +
						'&one_way=true';

				getData(calendar + requestData, (response) => {
						renderCheap(response, formData.when);
				});
		});

		getData(proxy + citiesApi, (data => {
				city = JSON.parse(data).filter((item) => {
						console.log(item);
						return item.name;
				});
		}));

});