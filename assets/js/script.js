var cityInputEL = document.querySelector("#city-input");
var citySearchEl = document.querySelector("#city-search");
var savedCitiesEl = document.querySelector("#saved-cities");
var clearSaveEl = document.querySelector("#clear-btn");
var savedCityButton = document.querySelector("#city-btn");
var currTemp = document.querySelector("#current-temp");
var currWind = document.querySelector("#current-wind");
var currHumidity = document.querySelector("#current-humidity");
var currUvi = document.querySelector("#current-uvi");
var currWeather = document.querySelector("#current-weather");
var cityHeader = document.querySelector("#city-header");
var cityHeaderText = "";
var uvContainer = document.querySelector("#uv-container")
var currentIcon = document.querySelector("#current-icon");
var today = moment().format("MM/DD/YY");

var savedCitiesArr = [];



var inputSubmitHandler = function () {
    event.preventDefault();

    var city = cityInputEL.value.trim();

    cityHeaderText = city;
    
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

                getWeather(longitude,lattitude,city);

                // console.log(data)
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
    savedCityBtn.id = "city-btn";

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
        savedCityBtn.id = "city-btn";

        savedCitiesEl.appendChild(savedCityBtn);
    };
};

var clearLocal = function() {
    localStorage.clear();
    savedCitiesEl.remove("button");
};

var cityBtn = function() {
    var city = event.target.textContent.trim();
    cityHeaderText = city;
    getCoordinates(city);
}

var getWeather = function(lattitude, longitude) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + longitude + "&lon=" + lattitude + "&units=imperial&appid=b4244de90737a4373c50c23818932a79"

    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
              currentWeather(data);
            //   console.log(data)
            })
        }
    })
}

var currentWeather = function(data) {
    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUv = data.current.uvi;
    var icon = data.current.weather[0].icon;
  
    currWeather.classList = "col-lg-8 col-sm-12 border border-2 border-dark"
    currTemp.textContent = "Temp: " + currentTemp + " °F";
    currWind.textContent = "Wind: " + currentWind + " MPH";
    currHumidity.textContent = "Humidity: " + currentHumidity + "%";
    currUvi.textContent = "Uv Index: ";
    uvContainer.textContent = currentUv;
    uvContainer.classList = "text-light rounded d-flex justify-content-center align-items-center px-2 m-2";
    cityHeader.textContent = cityHeaderText + "  " + today;
    currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png");

    if (currentUv < 3) {
        uvContainer.classList.add("bg-success");
    } else if (currentUv >= 3 && currentUv < 6) {
        uvContainer.classList.add("bg-warning");
    } else {
        uvContainer.classList.add("bg-danger");
    }
}

citySearchEl.addEventListener('submit', inputSubmitHandler)
clearSaveEl.addEventListener('click', clearLocal)
savedCitiesEl.addEventListener('click', cityBtn);
showSavedCities();

