//Set HTML elements as variables
var cityInputEL = $('#cityinput');
var searchButtonEL = $('#srchbtn');
var currentWeatherEL = $('#currentweather');
var forecastEL = $('#forecast');
//Set my unique OpenWeatherMap API key as a variable
var APIkey = '4e03668922cf56c28728986d0737b89e';
//Function for today's weather
var getCurrentWeather = (event) => {
    //collects user input
    var cityInput = cityInputEL.val();
    //Uses Geocoding API to get latitude and longitude from city name, to be used in forecast URL
    var geoQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + '&limit=1&appid=' + APIkey;
    fetch(geoQueryURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var forecastQueryURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIkey;
        fetch(forecastQueryURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            var currentWeatherIcon = 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png';
            var currentTimeUTC = data.list[0].dt;
            var currentTimeZoneOffset = data.city.timezone;
            var currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 /60;
            var currentTime = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
            //Runs 5 day forecast function
            getForecast(event);
            currentWeatherEL.addClass('border border-1 border-dark')
            //Create HTML elements for required datapoints
            var currentWeather = `
            <h3 class="p-1">${data.city.name} ${currentTime.format("MM/DD/YYYY")} <img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled p-1">
                <li class="py-2">Temp: ${data.list[0].main.temp} °F</li>
                <li class="py-2">Wind: ${data.list[0].wind.speed} MPH</li>
                <li class="py-2">Humidity: ${data.list[0].main.humidity}%</li>
            </ul>`;
            //Appends newly created elements to the page
            currentWeatherEL.html(currentWeather);

        })
    })
}

//Start 5 day forecast function
var getForecast = (event) => {
    //Utilizes same method as above to acquire lat and lon
    var cityInput = cityInputEL.val();
    var geoQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + '&limit=1&appid=' + APIkey;
    fetch(geoQueryURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var forecastQueryURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIkey;
        fetch(forecastQueryURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            var forecastHTML = `
            <h2>5-Day-Forecast:</h2>
            <div id="fiveDayForecastUL" class="d-inline-flex flex-wrap gap-3">
            `
            //For loop, creating a new card for each day in the forecast
            for (var i = 1; i < data.list.length; i++) {
                var listData = data.list[i];
                var forecastTimeUTC = listData.dt;
                var timeZoneOffset = data.city.timezone;
                var timeZoneOffsetHours = timeZoneOffset / 60 /60;
                var thisTime = moment.unix(forecastTimeUTC).utc().utcOffset(timeZoneOffsetHours);
                var iconURL = "http://openweathermap.org/img/w/" + listData.weather[0].icon + ".png";
                if (thisTime.format("HH:mm:ss") === "11:00:00" || thisTime.format("HH:mm:ss") === "12:00:00" || thisTime.format("HH:mm:ss") === "13:00:00") {
                    forecastHTML += `
                    <div class="weather-card card">
                        <ul class="list-unstyled p-2">
                            <li class="py-2"><h4>${thisTime.format("MM/DD/YYYY")}</h4></li>
                            <li class="weather-icon py-2"><img src="${iconURL}"></li>
                            <li class="py-2">Temp: ${listData.main.temp} °F</li>
                            <li class="py-2">Wind: ${listData.wind.speed} MPH</li>
                            <li class="py-2">Humidity: ${listData.main.humidity}%</li>
                        </ul>
                    </div>`;
                }
            }
            //Completes the forecast dive and appends to the page
            forecastHTML += `</div>`;
            forecastEL.html(forecastHTML);

        })
    })
}

//Event listener for search button
searchButtonEL.on("click", (event) => {
    event.preventDefault();
    getCurrentWeather(event);
})