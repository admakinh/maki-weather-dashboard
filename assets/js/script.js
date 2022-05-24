// api URL + key
var apiKey = "b6f060c7bda2e8f96d21a9c0d4ad8f20";
var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// vars
var displayTimeEl = document.querySelector("#current-time");

var searchFormEl = document.querySelector("#search-form-el")
var searchInputEl = document.querySelector("#search-input");

var displayedCityEl = document.querySelector("#displayed-city");
var currentWeatherEl = document.querySelector("#current-weather-el");

var fiveDayTitleEl = document.querySelector("#five-day-title-el");
var currentFiveDayEl = document.querySelector("#current-five-day-el");

var searchHistoryEl = document.querySelector("#search-hist-el");


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

var formSubmit = function (event) {
    event.preventDefault();
    var searchedCity = searchInputEl.value.trim();
    if (searchedCity) {
        cities.unshift({ searchedCity });
        searchInputEl.value = "";
    } else {
        alert("Enter a city to search");
    }
    saveSearch();
    pastSearch(searchedCity);
}

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
var loadOnRefresh = function () {
    var pastCities = JSON.parse(localStorage.getItem("cities"))
    
    for (let i = 0; i < pastCities.length; i++) {
        pastSearch(pastCities[i].city)
      }
    return
}

// submission listener
searchFormEl.addEventListener("submit", formSubmit);
loadOnRefresh();