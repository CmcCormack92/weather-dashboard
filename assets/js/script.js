var cityInputEL = document.querySelector("#city-input");
var citySearchEl = document.querySelector("#city-search")


var inputSubmitHandler = function () {
    event.preventDefault();

    var city = cityInputEL.value.toLowerCase().trim();

    if (city) {
        getCoordinates(city);

        cityInputEL.value = "";
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

                console.log(longitude);
                console.log(lattitude);
            })
        }
    })
};


citySearchEl.addEventListener('submit', inputSubmitHandler)







