// api key
var apiKey = "b6f060c7bda2e8f96d21a9c0d4ad8f20";



// vars
var displayTimeEl = document.querySelector("#current-time");

var searchFormEl = document.querySelector("#search-form-el")
var searchInputEl = document.querySelector("#search-input");

var displayedCityEl = document.querySelector("#displayed-city");
var currentWeatherEl = document.querySelector("#current-weather-el");

var fiveDayTitleEl = document.querySelector("#five-day-title-el");
var currentFiveDayEl = document.querySelector("#current-five-day-el");

var searchHistoryEl = document.querySelector("#search-hist-el");




var pastSearchButtonEl = document.querySelector("#search-hist-btn");
// function to display time
function getTime() {
    var currentTime = moment().format('MMM DD YYYY [at] hh:mm:ss a');
    // $("#time").text("Local Time: " + currentTime)
    displayTimeEl.textContent = "Current Local Time: " + currentTime;
}
// performs the funtion every second
setInterval(getTime, 1000);

// create an empty array to store cities in
var cities = [];

// take in user input
var formSubmit = function (event) {
    event.preventDefault();
    var city = searchInputEl.value.trim();
    if (city) {
        getWeather(city);
        getFiveDay(city);
        cities.unshift({ city });
        searchInputEl.value = "";
    } else {
        alert("Enter a city to search");
    }
    saveSearch();
    pastSearch(city);
}

// sace to local storage
var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};


// display search history
var pastSearch = function (pastSearch) {
    searchHistButton = document.createElement("button");
    searchHistButton.textContent = pastSearch;
    searchHistButton.classList = "d-flex w-120 btn-light border p-2";
    searchHistButton.setAttribute("data-city", pastSearch)
    searchHistButton.setAttribute("type", "submit");
    searchHistoryEl.prepend(searchHistButton);
}

// load on refresh
var loadHistOnRefresh = function () {
    var pastCities = JSON.parse(localStorage.getItem("cities"))
    
    for (let i = 0; i < pastCities.length; i++) {
        pastSearch(pastCities[i].city)
      }
    return
}

// search weather api
var getWeather = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);
        });   
    });
};

// get UV index
var getUV = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUVIndex(data)
            });
        });
 
}

// get 5 day forecast
var getFiveDay = function (city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function (response) {
        response.json().then(function (data) {
            displayFiveDay(data);
        });
    });
};

// display the weather
var displayWeather = function (weather, searchCity) {
    currentWeatherEl.textContent = "";
    displayedCityEl.textContent = searchCity;

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    displayedCityEl.appendChild(currentDate);

    var currentWeatherIcon = document.createElement("img")
    currentWeatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    displayedCityEl.appendChild(currentWeatherIcon);

    var currentTempEl = document.createElement("span");
    currentTempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    currentTempEl.classList = "list-group-item";

    var currentHumiEl = document.createElement("span");
    currentHumiEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentHumiEl.classList = "list-group-item";

    var currentWindEl = document.createElement("span");
    currentWindEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    currentWindEl.classList = "list-group-item";

    currentWeatherEl.appendChild(currentTempEl);
    currentWeatherEl.appendChild(currentHumiEl);
    currentWeatherEl.appendChild(currentWindEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    getUV(lat, lon);
}


var displayUVIndex = function (index) {
    var UVIndexEl = document.createElement("span");
    UVIndexEl.textContent = `UV Index: ${index.value}` ;

    if (index.value <=2) {
        UVIndexEl.classList = "list-group-item uv-good"
    } else if (index.value > 2 && index.value <=8) {
        UVIndexEl.classList = "list-group-item uv-bad"
    } else {
        UVIndexEl.classList = "list-group-item uv-ugly"
    }

    currentWeatherEl.appendChild(UVIndexEl);
    UVIndexEl.appendChild(uvIndexValue);
}

var displayFiveDay = function (weather) {
    currentFiveDayEl.textContent = ""
    fiveDayTitleEl.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var fiveDayData = forecast[i];
        var fiveDayEl = document.createElement("div");
        fiveDayEl.classList = "card bg-primary text-light m-2";


        var fiveDayDateEl = document.createElement("h5")
        fiveDayDateEl.textContent = moment.unix(fiveDayData.dt).format("MMM D, YYYY");
        fiveDayDateEl.classList = "card-header text-center"
        fiveDayEl.appendChild(fiveDayDateEl);


        var fiveDayIconEl = document.createElement("img")
        fiveDayIconEl.classList = "card-body text-center";
        fiveDayIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${fiveDayData.weather[0].icon}@2x.png`);

        
        var fiveDayTempEl = document.createElement("span");
        fiveDayTempEl.classList = "card-body text-center";
        fiveDayTempEl.textContent = fiveDayData.main.temp + " °F";
        
        
        var fiveDayHumiEl = document.createElement("span");
        fiveDayHumiEl.classList = "card-body text-center";
        fiveDayHumiEl.textContent = fiveDayData.main.humidity + "  %";
        
        
        fiveDayEl.appendChild(fiveDayIconEl);
        fiveDayEl.appendChild(fiveDayTempEl);
        fiveDayEl.appendChild(fiveDayHumiEl);
        currentFiveDayEl.appendChild(fiveDayEl);
    }
}

var submitHistSearch = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getWeather(city);
        getFiveDay(city);
    }
}


// submission listener
searchFormEl.addEventListener("submit", formSubmit);
searchHistoryEl.addEventListener("click", submitHistSearch);
loadHistOnRefresh();