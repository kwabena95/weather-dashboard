// UI Elements
const form = document.querySelector('#form');
const cityContainer = document.querySelector('.city-search');
const city = document.querySelector('.city');
const search = document.querySelector('#search');

// add Event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();



    fetchRequest();

})

function fetchRequest() {
    // UI elements
    const temp = document.querySelector('.temp');
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const uvIndex = document.querySelector('.uv-index');
    const head = document.querySelector('.sub-head');
    const CurrentDate = document.querySelector('span');

    // current date
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const cDate = ` (${month}/${day}/${year})`;

    // get search input
    const searchValue = search.value;
    const city = document.querySelector('.city');
    city.textContent = searchValue;
    cityContainer.appendChild(city);

    // get date

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

}

// 5 day forecast
function weeklyForecast(search) {
    // UI elements
    const weekly = document.querySelector('.daily-weather');
    const fiveDay = document.querySelector('.five-day-weather');


    const weeklyWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

    fetch(weeklyWeatherURL).then(res => {
        res.json().then(data => {

            const forecast = data.list;
            for (let i = 0; i < 5; i++) {

                const date = document.createElement('h3');
                date.classList.add('date');
                date.textContent = forecast[i].dt_txt;
                const icon = document.createElement('p');
                icon.classList.add('icon')
                icon.textContent = `icon`;
                const temp = document.createElement('p');
                temp.classList.add('f-temp')
                temp.textContent = `Temp: ${forecast[i].main.temp}`;
                const humidity = document.createElement('p');
                humidity.classList.add('f-humidity')
                humidity.textContent = `Humidity: ${forecast[i].main.humidity}`

                weekly.append(date, temp, icon, humidity);
                fiveDay.appendChild(weekly);
            }
        });

    });
};




