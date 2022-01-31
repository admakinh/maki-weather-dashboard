var apiKey = "b6f060c7bda2e8f96d21a9c0d4ad8f20";
var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}";
var userFormEl = $('#user-form');
var searchBtn = $('#search-button');
var searchBox = $('#search-input');

// var locURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=5&appid=" + apiKey;




var formSubmitHandler = function (event) {
    // event.preventDefault();

    var userInput = searchBox.val().trim();

    if (userInput) {
        getLatLong(userInput);

        searchBox.val('');
    } else {
        alert('Please enter a valid location');
    }
};

var getLatLong = function (latLong) {

    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + latLong + "&limit=5&appid=" + apiKey;

    console.log(geoURL);

    fetch(geoURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    var apiLatLong = "lat=" + data[0].lat + "&lon=" + data[0].lon;
                    var name = data[0].name + ', ' + data[0].state + ', ' + data[0].country;

                    var favorites

                    localStorage.setItem(name, JSON.stringify(apiLatLong));
                    weatherURL(apiLatLong);
                    createFavorite(name);

                });
            } else {
                alert("Error" + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweather');
        });
};


var weatherURL = function (getWeather) {

    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?' + getWeather + '&exclude=minutely,hourly&appid=' + apiKey;

    console.log(queryURL);

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    console.log(data);

                    // var apiLatLong = "lat=" + data[0].lat + "&lon=" + data[0].lon;
                    // var name = data[0].name + ', ' + data[0].state + ', ' + data[0].country;

                    // localStorage.setItem(name, JSON.stringify(apiLatLong));
                    // weatherURL(apiLatLong);

                });
            } else {
                alert("Error" + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweather');
        });
};

var buttonList = [];


var createFavorite = function (favCity) {
    var cityname = favCity;
    var buttonPush = JSON.stringify(favCity);
    buttonList.push(buttonPush);

    localStorage.setItem('buttons', JSON.stringify(buttonList));

    $(".fav-list").append("<button>" + cityname + "</button>");
    $(".fav-list").children("button").addClass("btn btn-primary fav-button");
    $("button").attr('type', 'button')

}


var storedCities = JSON.parse(localStorage.getItem('buttons'));



var loadButtons = function () {
    if (storedCities) {
        localStorage.removeItem('buttons');
        buttonList = [];


        if (storedCities) {
            buttonList.push(storedCities);
            localStorage.setItem('buttons', JSON.stringify(buttonList));

        }


        for (var i = 0; i < storedCities.length; i++) {



            $(".fav-list").append("<button>" + storedCities[i] + "</button>");
            $(".fav-list").children("button").addClass("btn btn-primary fav-button");
            $("button").attr('type', 'button')
        }

    }
}








userFormEl.submit(function (event) {
    event.preventDefault();
    formSubmitHandler();
});
loadButtons();