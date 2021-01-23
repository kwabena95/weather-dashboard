// UI Elements
const form = document.querySelector('#form');
const cityContainer = document.querySelector('.city-search');
const city = document.querySelector('.city');
const search = document.querySelector('#search');
let cities = [];
// add Event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();



    fetchRequest();
    getSearch()

})

function fetchRequest() {
    // UI elements
    const temp = document.querySelector('.temp');
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const uvIndex = document.querySelector('.uv-index');
    const head = document.querySelector('.sub-head');

    // current date
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const cDate = ` (${month}/${day}/${year})`;

    // get search input
    const searchValue = search.value;
    const city = document.createElement('li');
    city.classList.add('city')
    city.textContent += searchValue;
    cityContainer.appendChild(city);
    search.value = '';

    // fetch request
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

    fetch(currentWeatherURL).then(res => {
        res.json().then(data => {
            head.textContent = searchValue;
            head.textContent += cDate;
            temp.textContent = `Temperature: ${data.main.temp}`;
            humidity.textContent = `Humidity: ${data.main.humidity}`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed}`;
            uvIndex.textContent = `UV Index: ${data.wind.speed} [Not uv value]`;

        });
    });

    weeklyForecast(searchValue);
    saveSearch(searchValue);

}

// 5 day forecast
function weeklyForecast(search) {
    // UI elements
    const fiveDay = document.querySelector('.five-day-weather');

    const weeklyWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

    fetch(weeklyWeatherURL).then(res => {
        res.json().then(data => {

            for (let i = 0; i < data.list.length; i += 8) {
                let div = document.createElement('div');
                div.classList.add('daily-weather');
                div.style.marginRight = '10px';
                fiveDay.appendChild(div)

                const date = document.createElement('h3');
                date.classList.add('date');
                date.textContent = data.list[i].dt_txt;
                div.appendChild(date);

                const icon = document.createElement('p');
                icon.classList.add('icon')
                icon.textContent = data.list[0].weather[0].icon;
                div.appendChild(icon);

                const temp = document.createElement('p');
                temp.classList.add('f-temp')
                temp.textContent = `Temp: ${data.list[i].main.temp}`;
                div.appendChild(temp)
                const humidity = document.createElement('p');
                humidity.classList.add('f-humidity')
                humidity.textContent = `Humidity: ${data.list[i].main.humidity}`
                div.appendChild(humidity)
                fiveDay.appendChild(div);
            }
        });
    });

    // clear out div
    fiveDay.innerHTML = '';
};

// save search
function saveSearch(search) {
    let getCities = localStorage.getItem('cities');
    if (getCities === null) {
        cities = [];
    } else {
        cities = JSON.parse(getCities);
    }
    // add searches to array
    cities.push(search);

    // save to local storage
    localStorage.setItem('cities', JSON.stringify(cities));
}

// get search
function getSearch() {
    let getCities = localStorage.getItem('cities');
    if (getCities === null) {
        cities = [];
    } else {
        cities = JSON.parse(getCities);
    }

}



