// API_KEY is loaded from config.js
const weatherContainer = document.getElementById('weatherContainer');

function showLoading() {
    weatherContainer.innerHTML = '<div class="loading">Loading weather data...</div>';
}

function showError(message) {
    weatherContainer.innerHTML = `<div class="error">${message}</div>`;
}

function showSampleWeather() {
    weatherContainer.innerHTML = `<div class="loading">Welcome! Enter a city name or click the location button to see weather information.</div>`;
}

async function getWeatherByCity(city) {
    if (typeof API_KEY === 'undefined' || !API_KEY) {
        showError('API Key is missing. Please check config.js');
        return;
    }

    try {
        showLoading();

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=no`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayRealWeather(data);
    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error('Weather API Error:', error);
    }
}

async function getWeatherByCoords(lat, lon) {
    if (typeof API_KEY === 'undefined' || !API_KEY) {
        showError('API Key is missing. Please check config.js');
        return;
    }

    try {
        showLoading();

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=no`
        );
        
        if (!response.ok) {
            throw new Error('Unable to get weather data');
        }

        const data = await response.json();
        displayRealWeather(data);
    } catch (error) {
        showError('Unable to get weather data for your location');
        console.error('Weather API Error:', error);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                let errorMsg = 'Unable to get location';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Location access denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Location request timed out.';
                        break;
                }
                showError(errorMsg);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 
            }
        );
    } else {
        showError('Browser does not support location services');
    }
}

function displayRealWeather(data) {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;
    const today = forecast[0];
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date(location.localtime).toLocaleDateString('en-US', dateOptions);

    const temp = Math.round(current.temp_c);
    const feelsLike = Math.round(current.feelslike_c);
    const maxTemp = Math.round(today.day.maxtemp_c);
    const minTemp = Math.round(today.day.mintemp_c);

    weatherContainer.innerHTML = `
        <div class="weather-card">
            <div class="current-weather">
                <div class="weather-info">
                    <h2>${location.name}, ${location.country}</h2>
                    <p class="date">${dateString}</p>
                </div>
                
                <div class="temperature-container">
                    <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="weather-icon-lg">
                    <span class="temperature">${temp}°</span>
                </div>
                
                <p class="condition-text">${current.condition.text}</p>
                <div style="margin-top: 5px; opacity: 0.8;">Feels like ${feelsLike}°</div>
                <div style="margin-top: 5px; opacity: 0.8;">H:${maxTemp}° L:${minTemp}°</div>
            </div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <h4>Humidity</h4>
                    <p>${current.humidity}%</p>
                </div>
                <div class="detail-item">
                    <h4>Wind</h4>
                    <p>${Math.round(current.wind_kph)} km/h</p>
                </div>
                <div class="detail-item">
                    <h4>Pressure</h4>
                    <p>${current.pressure_mb} mb</p>
                </div>
                <div class="detail-item">
                    <h4>UV Index</h4>
                    <p>${current.uv}</p>
                </div>
                <div class="detail-item">
                    <h4>Visibility</h4>
                    <p>${current.vis_km} km</p>
                </div>
                <div class="detail-item">
                    <h4>Rain Chance</h4>
                    <p>${today.day.daily_chance_of_rain}%</p>
                </div>
            </div>
        </div>
        
        <div class="forecast-container">
            <h3 class="forecast-title">3-Day Forecast</h3>
            <div class="forecast-grid">
                ${forecast.slice(0, 3).map((day, index) => {
                    const date = new Date(day.date);
                    let dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateNum = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    return `
                        <div class="forecast-item">
                            <div class="forecast-day">${dayName}</div>
                            <div class="forecast-date">${dateNum}</div>
                            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" width="40" height="40">
                            <div class="forecast-temp">
                                <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                                <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

window.addEventListener('load', () => {
    showSampleWeather();
});
