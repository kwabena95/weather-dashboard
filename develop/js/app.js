// UI Elements
const form = document.querySelector('#form');
const cityContainer = document.querySelector('.city-search');
const search = document.querySelector('#search');
const fiveDay = document.querySelector('.five-day-weather');
const currentWeather = document.querySelector('.current-weather');
const para = document.querySelector('.uv-red');
const temp = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');
const head = document.querySelector('.sub-head');
let cities = [];

// add Event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchRequest();
});


// current date
const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear();
const cDate = ` (${month}/${day}/${year})`;


// fetch request
function fetchRequest() {

    // get search input
    const searchValue = search.value;
    const city = document.createElement('li');
    const link = document.createElement('a');
    link.setAttribute('href', '#');
    city.appendChild(link);
    city.classList.add('city');
    link.textContent += searchValue;
    cityContainer.prepend(city);
    search.value = '';



    // current weather url
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

    fetch(currentWeatherURL).then(res => {
        let longitude, latitude;

        res.json().then(data => {
            head.textContent = searchValue;
            head.textContent += cDate;
            temp.textContent = `Temperature: ${data.main.temp} F`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;
            longitude = data.coord.lon;
            latitude = data.coord.lat;

            // current weather icon
            const currentIcon = data.weather[0].icon;
            const currentWeatherImage = document.createElement('img');
            currentWeatherImage.classList.add('icon');
            currentWeatherImage.setAttribute('src', ` http://openweathermap.org/img/wn/${currentIcon}.png`);
            head.appendChild(currentWeatherImage);

            // uv index url
            const uvIndexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=6b23f6fe88ff8a8f7321d2e253c96454`;

            fetch(uvIndexURL).then(res => res.json())
                .then(data => {
                    const uvIndex = document.createElement('span');
                    uvIndex.classList.add('uv-index');
                    uvIndex.innerHTML = data.current.uvi;
                    para.textContent = 'UV Index:';
                    para.appendChild(uvIndex);

                    let uvIndicator = parseInt(uvIndex.textContent);
                    if (uvIndicator >= 0 && uvIndicator <= 2) {
                        uvIndex.style.background = 'green';
                        uvIndex.style.color = 'white';
                    } else if (uvIndicator >= 3 && uvIndicator <= 5) {
                        uvIndex.style.background = 'yellow';
                        uvIndex.style.color = 'black';
                    }
                    else if (uvIndicator >= 6 && uvIndicator <= 7) {
                        uvIndex.style.background = '#FF4F00';
                        uvIndex.style.color = 'white';
                    } else if (uvIndicator >= 8 && uvIndicator <= 10) {
                        uvIndex.style.background = '#FF2100';
                        uvIndex.style.color = 'white';
                    } else {
                        uvIndex.style.background = '#932FCF';
                        uvIndex.style.color = 'white';
                    }
                })
        }).catch(error => {
            const errorMsg = document.createElement('p');
            errorMsg.style.color = '#dc3545';
            errorMsg.textContent = `Search name "${searchValue}" was not found.`;
            errorMsg.style.fontSize = '1.3rem';
            currentWeather.appendChild(errorMsg);

            // remove error message after 3 seconds
            setTimeout(() => errorMsg.remove(), 3000);
        });
    });

    weeklyForecast(searchValue);
    saveSearch(searchValue);

}

// 5 day forecast
function weeklyForecast(search) {

    // forecast url
    const weeklyWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

    fetch(weeklyWeatherURL).then(res => {
        res.json().then(data => {

            for (let i = 0; i < data.list.length; i += 8) {
                let div = document.createElement('div');
                div.classList.add('daily-weather');
                div.style.marginRight = '10px';
                fiveDay.appendChild(div);

                const date = document.createElement('h3');
                date.classList.add('date');
                // get only the date and replace the dash with forward lash
                let newDate = data.list[i].dt_txt.slice(0, 11).replace(/-/g, '/');
                // format the date to (MM/DD/YYYY)
                let dateFormat = newDate.split('/').sort((a, b) => a - b).join('/');
                date.textContent = dateFormat;
                div.appendChild(date);

                const icon = document.createElement('img');
                weatherIcon = data.list[0].weather[0].icon;
                icon.setAttribute('src', ` http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                icon.classList.add('icon');

                div.appendChild(icon);

                const temp = document.createElement('p');
                temp.classList.add('f-temp');
                temp.textContent = `Temp: ${data.list[i].main.temp} F`;
                div.appendChild(temp);
                const humidity = document.createElement('p');
                humidity.classList.add('f-humidity');
                humidity.textContent = `Humidity: ${data.list[i].main.humidity}%`;
                div.appendChild(humidity);
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

        // loop through cities array
        cities.forEach(searchCity => {
            const city = document.createElement('li');
            const link = document.createElement('a');
            city.appendChild(link);
            link.setAttribute('href', '#');
            city.classList.add('city');
            link.textContent += searchCity;
            cityContainer.prepend(city);

            // add a click event for user to return back to previous searches
            link.addEventListener('click', () => {
                const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=6b23f6fe88ff8a8f7321d2e253c96454&units=imperial`;

                fetch(currentWeatherURL).then(res => {
                    let longitude, latitude;
                    res.json().then(data => {
                        head.textContent = searchCity;
                        head.textContent += cDate;
                        temp.textContent = `Temperature: ${data.main.temp} F`;
                        humidity.textContent = `Humidity: ${data.main.humidity}%`;
                        windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;
                        longitude = data.coord.lon;
                        latitude = data.coord.lat;

                        // current weather icon
                        const currentIcon = data.weather[0].icon;
                        const currentWeatherImage = document.createElement('img');
                        currentWeatherImage.classList.add('icon');
                        currentWeatherImage.setAttribute('src', ` http://openweathermap.org/img/wn/${currentIcon}.png`);
                        head.appendChild(currentWeatherImage);

                        // get uv index
                        const uvIndexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=6b23f6fe88ff8a8f7321d2e253c96454`

                        fetch(uvIndexURL).then(res => res.json())
                            .then(data => {
                                const uvIndex = document.createElement('span');
                                uvIndex.classList.add('uv-index');
                                uvIndex.innerHTML = data.current.uvi;
                                para.textContent = 'UV Index:';
                                para.appendChild(uvIndex);

                                let uvIndicator = parseInt(uvIndex.textContent);
                                if (uvIndicator >= 0 && uvIndicator <= 2) {
                                    uvIndex.style.background = 'green';
                                    uvIndex.style.color = 'white';
                                } else if (uvIndicator >= 3 && uvIndicator <= 5) {
                                    uvIndex.style.background = 'yellow';
                                    uvIndex.style.color = 'black';
                                }
                                else if (uvIndicator >= 6 && uvIndicator <= 7) {
                                    uvIndex.style.background = '#FF4F00';
                                    uvIndex.style.color = 'white';
                                } else if (uvIndicator >= 8 && uvIndicator <= 10) {
                                    uvIndex.style.background = '#FF2100';
                                    uvIndex.style.color = 'white';
                                } else {
                                    uvIndex.style.background = '#932FCF';
                                    uvIndex.style.color = 'white';
                                }
                            });
                    });

                });

                weeklyForecast(searchCity);

            });

        });

    }

}
// run
getSearch();





