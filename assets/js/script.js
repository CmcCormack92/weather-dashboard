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
var forcastContainer = document.querySelector("#daily-forcast");

// handles the form input when city is entered
var inputSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEL.value.trim();

    cityHeaderText = city;

    if (city === "") {

        alert("Please Enter a City Name")
        return
    } else {
        getCoordinates(city);
        // createSavedSearch(city);
        getSavedCities(city)
        cityInputEL.value = "";
    }
}

// gets the cities coordinates to use with one call api
var getCoordinates = function (city) {
    var geoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=b4244de90737a4373c50c23818932a79";

    fetch(geoUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var longitude = data.coord.lon;
                var lattitude = data.coord.lat;

                getWeather(longitude, lattitude, city);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to get coordinates!")
        })
};

// gets the saved cities from local storage
var getSavedCities = function (city) {
    var storage = JSON.parse(localStorage.getItem("saved-city"));

    if (storage === null) {
        storage = [];
    }
    storage.push(city)
    localStorage.setItem('saved-city', JSON.stringify(storage))
    showSavedCities()
};

// appends the cities saved in local storage to the browser
var showSavedCities = function () {
    // getSavedCities();
    savedCitiesEl.textContent = ''
    var storage = JSON.parse(localStorage.getItem("saved-city"));

    if (storage === null) {
        savedCitiesEl.textContent = 'No Search History'
    } else {
        savedCitiesEl.textContent = ''
        for (var i = 0; i < storage.length; i++) {
            var savedCityBtn = document.createElement("button");
            savedCityBtn.classList = "btn btn-lg btn-secondary col-12 text-light rounded my-1"
            savedCityBtn.textContent = storage[i];
            savedCityBtn.id = "city-btn";
    
            savedCitiesEl.appendChild(savedCityBtn);
        };
    }

};

// clears local storage and removes the saved city buttons from the page
var clearLocal = function (e) {
    e.preventDefault()
    localStorage.clear();
    showSavedCities()
};

// adds function to the saved city buttons so they can be used as a quick search
var cityBtn = function (event) {
    var city = event.target.textContent.trim();
    cityHeaderText = city;
    getCoordinates(city);
}

// gets weather for the requested city from open weather one call api
var getWeather = function (lattitude, longitude) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + longitude + "&lon=" + lattitude + "&units=imperial&appid=b4244de90737a4373c50c23818932a79"

    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                currentWeather(data);
                fiveDay(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to Open Weather!")
        });
};

//gets the current weather conditions and displays them to the page
var currentWeather = function (data) {
    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUv = data.current.uvi;
    var icon = data.current.weather[0].icon;

    currWeather.classList = "col-12  border border-2 border-dark my-3 justify-content-center"
    currTemp.textContent = "Temp: " + currentTemp + " °F";
    currWind.textContent = "Wind: " + currentWind + " MPH";
    currHumidity.textContent = "Humidity: " + currentHumidity + "%";
    currUvi.textContent = "Uv Index: ";
    uvContainer.textContent = currentUv;
    uvContainer.classList = "text-light fw-bold rounded d-flex justify-content-center align-items-center px-2 m-2";
    cityHeader.textContent = cityHeaderText + "  (" + today + ")";
    currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png");

    // changes uv index color based on conditions
    if (currentUv < 3) {
        uvContainer.classList.add("bg-success");
    } else if (currentUv >= 3 && currentUv < 6) {
        uvContainer.classList.add("bg-warning");
    } else {
        uvContainer.classList.add("bg-danger");
    }
}

//gets the weather conditions for the next 5 days and displays them to the page
var fiveDay = function (data) {
    while (forcastContainer.firstChild) {
        var div = document.querySelector("#day-weather");
        forcastContainer.removeChild(div);
    };

    var fiveDayHeader = document.querySelector("#five-day-header");
    fiveDayHeader.textContent = "5-Day Forecast:"


    for (var i = 1; i < 6; i++) {
        var forcastTemp = data.daily[i].temp.day;
        var forcastWind = data.daily[i].wind_speed;
        var forcastHumidity = data.daily[i].humidity;
        var forcastIcon = data.daily[i].weather[0].icon;
        var forecastDate = data.daily[i].dt;
        var dayContainer = document.createElement("div");
        dayContainer.id = "day-weather"

        forcastContainer.appendChild(dayContainer);

        var daysDate = moment.unix(forecastDate).format("MM/DD/YY");

        dayContainer.classList = "text-white bg-primary col-lg-2 col-md-2 col-sm-8 py-2 px-2 my-1 mx-1 flex-fill"

        var dateHeader = document.createElement("h5");
        dateHeader.classList = "fw-bold fs-md-6";
        dateHeader.textContent = daysDate;
        dayContainer.appendChild(dateHeader);

        var dailyIcon = document.createElement("img");
        dailyIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + forcastIcon + ".png");
        dayContainer.appendChild(dailyIcon);

        var dailyTemp = document.createElement("h6");
        dailyTemp.textContent = "Temp: " + forcastTemp + " °F";
        dayContainer.appendChild(dailyTemp);

        var dailyWind = document.createElement("h6");
        dailyWind.textContent = "Wind: " + forcastWind + " MPH";
        dayContainer.appendChild(dailyWind);

        var dailyHumidity = document.createElement("h6");
        dailyHumidity.textContent = "Humidity: " + forcastHumidity + "%"
        dayContainer.appendChild(dailyHumidity);
    }
};

citySearchEl.addEventListener('submit', inputSubmitHandler)
clearSaveEl.addEventListener('click', clearLocal)
savedCitiesEl.addEventListener('click', cityBtn);
showSavedCities();

