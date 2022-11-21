var cityInputEL = $('#cityinput');
var searchButtonEL = $('#srchbtn');
var searchHistoryEL = $('#searchhistory');
var currentWeatherEL = $('#currentweather');
var forecastEL = $('#forecast');
var APIkey = '4e03668922cf56c28728986d0737b89e';

var getCurrentWeather = (event) => {
    var cityInput = cityInputEL.val();
    var coordQueryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + '&limit=1&appid=' + APIkey;
    fetch(coordQueryURL)
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
            var currentWeatherIcon = 'http://openweathermap.org/img/w/' + data.list[0].weather.icon + '.png';
            var currentTimeUTC = data.list[0].dt;
            var currentTimeZoneOffset = data.city.timezone;
            var currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 /60;
            var currentTime = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

            currentWeatherEL.addClass('border border-1 border-dark')
            var currentWeather = `
            <h3>${data.city.name} ${currentTime.format("MM/DD/YYYY")} <img src="${currentWeatherIcon}"/></h3>
            <ul class="list-unstyled">
                <li class="py-2">Temp: ${data.list[0].main.temp} °F</li>
                <li class="py-2">Wind: ${data.list[0].wind.speed} MPH</li>
                <li class="py-2">Humidity: ${data.list[0].main.humidity}%</li>
            </ul>`;
            currentWeatherEL.html(currentWeather);
        })
    })
}

searchButtonEL.on("click", (event) => {
    event.preventDefault();
    getCurrentWeather(event);
})