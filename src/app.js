/* Function to format the current date and time */
function formatDateToday(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = "";

  if (hours >= 12) {
    ampm = "p.m.";
  } else {
    ampm = "a.m.";
  }
  hours = hours % 12;
  if (hours === 0) hours = 12;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hours}:${minutes} ${ampm}`;
}

function formatDay(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  for (let i = 0; i < 5; i++) {
    forecastHTML =
      forecastHTML +
      `<div class="col mini-weather-col">
              <h6>${formatDay(forecast[i].dt)}</h6>
              <img src="http://openweathermap.org/img/wn/${
                forecast[i].weather[0].icon
              }@2x.png" alt=""  class="weather-icon"/>
              <h6>
                <span class="weather-forecast-max-temp">${Math.round(
                  forecast[i].temp.max
                )}°</span
                ><span class="weather-forecast-min-temp">${Math.round(
                  forecast[i].temp.min
                )}°</span>
              </h6>
            </div></div>`;
  }
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let unit = "metric";
  let apiKey = "ff1d9ea9376b5c27a82e04fc2b2abdbb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

/* Function to search the city from the Weather API */
function searchCity(city) {
  let unit = "metric";
  let apiKey = "2b99915330dc99299d86e98273a6a560";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showInformation);
}

/* Function to get the event when the search button is clicked */
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#text-city");
  if (city.value) {
    city = city.value.toLowerCase();
    city = city.trim();
    searchCity(city);
  }
}

/* Function to diable the Fahrenheit Button */
function disableFahrenheit() {
  let disablefahrenheit = document.getElementById("fahrenheit");
  disablefahrenheit.classList.add("disabled");

  let enablecelsius = document.getElementById("celsius");
  enablecelsius.classList.remove("disabled");
}

/* Function to diable the Celsius Button */
function disableCelsius() {
  let disablecelsius = document.getElementById("celsius");
  disablecelsius.classList.add("disabled");

  let enablefahrenheit = document.getElementById("fahrenheit");
  enablefahrenheit.classList.remove("disabled");
}

/* Function to convert the temperature to Fahrenheit */
function tempToFahrenheit(event) {
  event.preventDefault();

  let temp = document.getElementById("currentTemp").innerHTML;
  let temperature = document.querySelector("#currentTemp");

  let fahrenheit = Math.round(temp) * 1.8 + 32;
  fahrenheit = Math.round(fahrenheit);
  temperature.innerHTML = `${fahrenheit}`;

  disableFahrenheit();
}

/* Function to convert the temperature to Celsius */
function tempToCelsius(event) {
  event.preventDefault();

  let temp = document.getElementById("currentTemp").innerHTML;
  let temperature = document.querySelector("#currentTemp");

  let celsius = (Math.round(temp) - 32) * 0.5556;
  celsius = Math.round(celsius);
  temperature.innerHTML = `${celsius}`;

  disableCelsius();
}

function showInformation(response) {
  console.log(response.data);
  let city = response.data.name;
  let temp = Math.round(response.data.main.temp);
  let feels = Math.round(response.data.main.feels_like);
  let humid = response.data.main.humidity;
  let weather = response.data.weather[0].main;
  let wind = Math.round(response.data.wind.speed);

  let icon = response.data.weather[0].icon;

  let cityText = document.querySelector("#city-text");
  let temperature = document.querySelector("#currentTemp");
  let feelsLike = document.querySelector("#feels-like");
  let humidity = document.querySelector("#humidity");
  let weatherDesc = document.querySelector("#weather-desc");
  let windSpeed = document.querySelector("#wind-speed");
  let weatherIcon = document.querySelector("#weather-icon");

  cityText.innerHTML = `${city}`;
  temperature.innerHTML = `${temp}`;
  feelsLike.innerHTML = `Feels-like: ${feels}°`;
  humidity.innerHTML = `Humidity: ${humid}%`;
  windSpeed.innerHTML = `Wind: ${wind} mph`;
  weatherDesc.innerHTML = `${weather}`;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  disableCelsius();
  getForecast(response.data.coord);
}

function initiateGeolocator() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let weatherApiKey = "2b99915330dc99299d86e98273a6a560";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;

  axios.get(weatherApiUrl).then(showInformation);
}

searchCity("Tokyo");
disableCelsius();
let todayDate = new Date();
let dateToday = document.querySelector("#date-time-today");
dateToday.innerHTML = formatDateToday(todayDate);

/* When the Fahrenheit Button is Clicked */
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", tempToFahrenheit);

/* When the Celsius Button is Clicked */
let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", tempToCelsius);

/* When the Current Location Button is Clicked */
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", initiateGeolocator);

/* When the Search Button is Clicked */
let searchCityName = document.querySelector("#search-city");
searchCityName.addEventListener("submit", handleSubmit);
