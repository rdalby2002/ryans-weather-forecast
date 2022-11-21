var cityInputEL = $('#cityinput');
var searchButtonEL = $('#srchbtn');
var searchHistoryEL = $('#searchhistory');
var currentWeatherEL = $('#currentweather');
var forecastEL = $('forecast');
var APIkey = '4e03668922cf56c28728986d0737b89e';

var getCurrentWeather = (event) => {
    var city = cityInputEL.val();
    var coordQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIkey;
    fetch(coordQueryURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var forecastQueryURL = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIkey;
        fetch(forecastQueryURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            var currentWeatherIcon = 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png';
            var currentTimeUTC = response.dt;
            var currentTimeZoneOffset = response.timezone;
            var currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 /60;
            var currentTime = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

            var currentWeather = `
            <h3>${response.name} ${currentTime.format("MM/DD/YYY")}<img src="${currentWeatherIcon}"/></h3>
            <ul class="list-unstyled">
                <li>Temp: ${response.main.temp} °F;</li>
                <li>Wind: ${response.wind.speed} MPH</li>
                <li>Humidity: ${response.main.humidity}%</li>
            </ul>`;
            currentWeatherEL.html(currentWeather);
        })
    })
}

searchButtonEL.on("click", (event) => {
    event.preventDefault();
    getCurrentWeather(event);
})