'use strict';

document.addEventListener('DOMContentLoaded', () => {

		
		const formSearch = document.querySelector('.form-search'),
				inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
				inputCitiesTo = formSearch.querySelector('.input__cities-to'),
				dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
				dropdownСitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
				inputDateDepart = formSearch.querySelector('.input__date-depart'),
				cheapestTicket = document.getElementById('cheapest-ticket'),
				modal = document.querySelector('.modal'),
				modaBtnlOk = document.querySelector('.modal-ok'),
				otherCheapTickets = document.getElementById('other-cheap-tickets');
				
			// http://api.travelpayouts.com/data/ru/cities.json
			// http://min-prices.aviasales.ru/calendar_preload?origin_iata=MOV&destination_iata=VKT&depart_date=2020-05-25
			// dataBase/cities.json
			// http://min-prices.aviasales.ru/calendar_preload?origin=MOV&destination=VKT&depart_date=2020-05-25&one_way=true
			// http://min-prices.aviasales.ru/calendar_preload
		const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
					citiesApiLocal = 'dataBase/cities.json',
						proxy = 'https://cors-anywhere.herokuapp.com/',
						API_KEY = '34e51bc0013fd0bc3565d14409409b25',
						calendar = 'http://min-prices.aviasales.ru/calendar_preload',
						MAX_COUNT = 10;
		let city = [];
		// const city = ['Москва', 'Санкт-Петербург', 'Минск','Караганда',
		// 'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск',
		// 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкен', 'Нижний Новгорог',
		// 'Калининград', 'Вроцлав', 'Ростов-на-дону'];
		
		const showModal = (message) => {			
			modal.style.display = "block";
			let modalBodyContent = modal.querySelector('.modal-body-content');
			modalBodyContent.textContent = '';
			modalBodyContent.insertAdjacentHTML('beforeend', message);
		};
		modal.addEventListener('click', (event) => {
			let target = event.target;
			if (target.classList.contains('modal-overlay')) {
				modal.style.display = "none";
			}
		});
		modaBtnlOk.addEventListener('click', () => {
			modal.style.display = "none";
		});
		
		const getData = (url, callback, reject = console.error) => {
		
				const request = new XMLHttpRequest();
				request.open('GET', url);
				request.addEventListener('readystatechange', () => {
					if (request.readyState !== 4) return;

					if (request.status === 200) {
							callback(request.response);
					} else {
							reject(request.status);
					}
				});				
				request.send();			
			
		};
		const showCity = (input, list) => {
			list.textContent = '';

			if (input.value !== '') {
				const filterCity = city.filter((item) => {
					const fixItem = item.name.toLowerCase();
					return fixItem.startsWith(input.value.toLowerCase());                    
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
		const getNameCity = (code) => {
			const obCity = city.find((item) => item.code === code);
			return obCity.name;
		};
		const getDate = (date) => {
			return new Date(date).toLocaleString('ru-RU', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		};
		const getChanges = (num) => {
			if (num) {
				return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
			} else {
				return "Без пересадок";
			}
		};
		const getLinkAviasales = (data) => {
			let link = 'https://www.aviasales.ru/search/';
			link += data.origin;
			const date = new Date(data.depart_date);
			const day = date.getDate();

			link += day < 10 ? '0' + day : day;
			const month = date.getMonth() + 1;
			link += month < 10 ? '0' + month : month;

			link += data.destination;
			console.log(link); 
			// SVX2905KGD1
			// console.log(data);
			return link + 1;
		};
		const createCard = (data) => {
			const ticket =document.createElement('article');
				ticket.classList.add('ticket');
			let deep = '';
			if (data) {
				deep = `
				<h3 class="agent">${data.gate}</h3>
				<div class="ticket__wrapper">
					<div class="left-side">
						<a href="${getLinkAviasales(data)}" class="button button__buy" target="_blanck">Купить
							за ${data.value}</a>
					</div>
					<div class="right-side">
						<div class="block-left">
							<div class="city__from">Вылет из города
								<span class="city__name">${getNameCity(data.origin)}</span>
							</div>
							<div class="date">${getDate(data.depart_date)}</div>
						</div>

						<div class="block-right">
							<div class="changes">${getChanges(data.number_of_changes)}</div>
							<div class="city__to">Город назначения:
								<span class="city__name">${getNameCity(data.destination)}</span>
							</div>
						</div>
					</div>
				</div>
				`;
			} else {
				deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>';
			}
			ticket.insertAdjacentHTML('afterbegin', deep);
			return ticket;
		}

		const renderCheapDay = (cheapTicket) => {
			cheapestTicket.style.display = 'block';
			cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';		

			const ticket = createCard(cheapTicket[0]);
			cheapestTicket.append(ticket);		
		};

		const renderCheapYear = (cheapTickets) => {
			otherCheapTickets.style.display = 'block';
			otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
			cheapTickets.sort((a, b) => {
				if (a.value > b.value) {
					return 1;
				}
				if (a.value < b.value) {
					return -1;
				}				
				return 0;
			});

			for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
				const ticket = createCard(cheapTickets[i]);
				otherCheapTickets.append(ticket);				
			}
		
		};
		const renderCheap = (data, date) => {
			const cheapTicketYear = JSON.parse(data).best_prices;        
			const cheapTicketDay = cheapTicketYear.filter((item) => {
					return item.depart_date === date;
			});
			
			renderCheapDay(cheapTicketDay);
			renderCheapYear(cheapTicketYear);
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
					from: city.find((item) => inputCitiesFrom.value === item.name),
					to: city.find((item) => inputCitiesTo.value === item.name),
					when: inputDateDepart.value,
			};
				if (formData.from && formData.to) {
					const requestData = `?depart_date=${formData.when}&origin=${formData.when} \n
						&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

					getData(calendar + requestData, (response) => {
						renderCheap(response, formData.when);
					}, (error) => {
						showModal('В этом направлении нет рейсов');
						console.error('Ошибка ', error);
					});
				} else {
					showModal('Введите корректное название города');
				}
								
		});

		getData(proxy + citiesApi, (data) => {
				city = JSON.parse(data).filter(item => item.name);
				city.sort((a, b) => {
					if (a.name > b.name) {
						return 1;
					}
					if (a.name < b.name) {
						return -1;
					}
					// a должно быть равным b
					return 0;
				});
		});

});