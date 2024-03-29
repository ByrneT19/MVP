'use strict'
                
function getWeather(CORDS) {
    console.log('from getWeather', CORDS);
    const url = `https://api.openweathermap.org/data/2.5/find?lat=${CORDS[0]}&lon=${CORDS[1]}&units=metric&appid={INSERT YOUR API KEY HERE}`;
    fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(responseJson => showResult(responseJson))
    .catch(err => {
        alert(err.message)
    })
}

function gpsLoc(latLong) {
    console.log('from gpsLoc', latLong);
    const mapUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?unit=mph&key={INSERT YOUR API KEY HERE}&point=${latLong}`;
    fetch(mapUrl)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(responseJson => showGps(responseJson))
    .catch(err => {
        alert(err.message)
    })
}

function showResult(responseJson) {
    console.log('from showResult', responseJson);
    $('#weather-container').empty();
    $('#weather-container').show();
    let weatherIcon = responseJson.list[0].weather[0].icon;
    console.log('weather icon is', weatherIcon);
    let iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;
    let i = null;
    for(i = 0; i < responseJson.list[0].weather.length; i++) {
        $('#weather-container').append(`
        <h2>Weather at Location</h2>
              <div id="icon">
            <img id="yunHua" src="${iconUrl}" alt="Weather icon">
        </div>
        <p>Current temperature: ${Math.floor(responseJson.list[0].main.temp)}&#8451</p>
        <p>Feels like: ${Math.floor(responseJson.list[0].main.feels_like)}&#8451</p>
        <h3>${responseJson.list[0].weather[0].main}</h3>  
        <p>${responseJson.list[0].weather[0].description}</p>
        `)
    }
}

function showGps(responseJson) {
    console.log('from showGps', responseJson);
    $('.traffic-container').empty();
    $('.traffic-container').show();
    let kpmh = Math.round(responseJson.flowSegmentData.currentSpeed * 1.6);
    let ikm = Math.round(responseJson.flowSegmentData.freeFlowSpeed * 1.6);
    $('.traffic-container').append(`
    <h2>Traffic Information at Location</h2>
    <p>Average Speed: ${responseJson.flowSegmentData.currentSpeed} mph</p>
    <p>Average Speed: ${kpmh} km/h</p>
    <p>Speed in Ideal Conditions: ${responseJson.flowSegmentData.freeFlowSpeed} mph</p>
    <p>Speed in Ideal Conditions: ${ikm} km/h;
    `)
}

function getLocation(wgs, country) {
    const locUrl = `https://api.opencagedata.com/geocode/v1/json?q=${wgs},${country}&min_confidence=8&roadinfo=1&key={INSERT YOUR API KEY HERE}&pretty=1`;
    fetch(locUrl) 
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(responseJson => locResult(responseJson))
    .catch(err => {
        alert(err.message)
    })
}

function locResult(responseJson) {
    // console.log('from locResult', results);
    console.log('from locResult', responseJson);
    const CORDS = [responseJson.results[0].geometry.lat, responseJson.results[0].geometry.lng];
    const latLong = `${responseJson.results[0].geometry.lat},${responseJson.results[0].geometry.lng}`;
    getWeather(CORDS);
    gpsLoc(latLong);
}

function locationClick() {
    $('.location-form').on('submit', function(e) {
        e.preventDefault();
        console.log(e);
        const wgs = $('#user-input').val();
        const country = $('#pays').val();
        console.log(wgs, country);
        getLocation(wgs, country);
    })
}

function run() {
    locationClick();
}

$(run);

// let wgs = [];
// $('wgs').push($('#user-input')).split(',');
// const chez = $('#chez').val().split(',')

//it should be responseJson.results.filter( x => x.components._type === postcodde)
