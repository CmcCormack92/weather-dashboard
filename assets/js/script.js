var cityInputEL = document.querySelector("#city-input");
var citySearchEl = document.querySelector("#city-search");
var savedCitiesEl = document.querySelector("#saved-cities");
var clearSaveEl = document.querySelector("#clear-btn");

var savedCitiesArr = [];


var inputSubmitHandler = function () {
    event.preventDefault();

    var city = cityInputEL.value.trim();

    if (city) {
        getCoordinates(city);
        createSavedSearch(city);

        cityInputEL.value = "";
        savedCitiesArr.push(city);
        localStorage.setItem("saved-city", JSON.stringify(savedCitiesArr));
    } else {
        alert("Please Enter a City Name")
    }
}

var getCoordinates = function (city) {
    var geoUrl = "http://api.geonames.org/searchJSON?q=" + city + "&username=cmccormack92";

    fetch(geoUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var longitude = data.geonames[0].lng;
                var lattitude = data.geonames[0].lat;

                // console.log(longitude);
                // console.log(lattitude);
            })
        }
    })
};

var createSavedSearch = function (city) {
    var savedCityBtn = document.createElement("button");
    savedCityBtn.classList = "btn btn-lg btn-secondary col-12 text-light rounded my-1"
    savedCityBtn.textContent = city;

    savedCitiesEl.appendChild(savedCityBtn);
};

var getSavedCities = function () {
    var storage = JSON.parse(localStorage.getItem("saved-city"));

    if (storage === null) {
        storage = [];
    } else {
        savedCitiesArr = storage;
    }
};

var showSavedCities = function () {
    getSavedCities();

    for (var i = 0; i < savedCitiesArr.length; i++) {
        var savedCityBtn = document.createElement("button");
        savedCityBtn.classList = "btn btn-lg btn-secondary col-12 text-light rounded my-1"
        savedCityBtn.textContent = savedCitiesArr[i];

        savedCitiesEl.appendChild(savedCityBtn);
    };
};

var clearLocal = function() {
    localStorage.clear();
    savedCitiesEl.remove("button");
};

citySearchEl.addEventListener('submit', inputSubmitHandler)
clearSaveEl.addEventListener('click', clearLocal)
showSavedCities()






