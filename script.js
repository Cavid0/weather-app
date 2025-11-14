
const API_KEY = '2f723f6ac1a44997b17195306251405'; 
const weatherContainer = document.getElementById('weatherContainer');

const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '🌨️', '13n': '🌨️',
    '50d': '🌫️', '50n': '🌫️'
};

function showLoading() {
    weatherContainer.innerHTML = '<div class="loading">Loading...</div>';
}

function showError(message) {
    weatherContainer.innerHTML = `<div class="error">${message}</div>`;
}

async function getWeatherByCity(city) {
    try {
        showLoading();

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=yes`
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
    try {
        showLoading();

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=yes`
        );
        
        if (!response.ok) {
            throw new Error('Unable to get weather data');
        }

        const data = await response.json();
        displayRealWeather(data);
    } catch (error) {
        showError('Unable to get weather data for your location');
        console.error('Weather API Error:', error);
        // Fallback to London
        setTimeout(() => {
            getWeatherByCity('London');
        }, 2000);
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
                setTimeout(() => {
                    getWeatherByCity('London');
                }, 2000);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 
            }
        );
    } else {
        showError('Browser does not support location services');
   
        setTimeout(() => {
            getWeatherByCity('London');
        }, 2000);
    }
}

function displayRealWeather(data) {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;
    const today = forecast[0];
    
    const temp = Math.round(current.temp_c);
    const feelsLike = Math.round(current.feelslike_c);
    const maxTemp = Math.round(today.day.maxtemp_c);
    const minTemp = Math.round(today.day.mintemp_c);

    const localTime = new Date(location.localtime);
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: location.tz_id
    };
    const localTimeString = localTime.toLocaleTimeString('en-US', timeOptions);
    
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <div class="current-weather">
                <div class="weather-info">
                    <h2>${location.name}, ${location.country}</h2>
                    <p style="text-transform: capitalize; font-size: 1.2rem; margin-bottom: 1rem;">${current.condition.text}</p>
                    <p>Feels like: ${feelsLike}°C</p>
                    <p style="font-size: 1.1rem; opacity: 0.9; margin-top: 0.5rem;">Today: H:${maxTemp}° L:${minTemp}°</p>
                    <p style="font-size: 1rem; opacity: 0.8; margin-top: 0.5rem;">Local time: ${localTimeString}</p>
                </div>
                <div class="weather-icon">
                    <img src="https:${current.condition.icon}" alt="${current.condition.text}" 
                         style="width: 120px; height: 120px; filter: drop-shadow(0 4px 15px rgba(255, 255, 255, 0.3));">
                </div>
                <div class="temperature">${temp}°</div>
            </div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <h4>Humidity</h4>
                    <p>${current.humidity}%</p>
                </div>
                <div class="detail-item">
                    <h4>Wind Speed</h4>
                    <p>${current.wind_kph} km/h</p>
                </div>
                <div class="detail-item">
                    <h4>Pressure</h4>
                    <p>${current.pressure_mb} mb</p>
                </div>
                <div class="detail-item">
                    <h4>UV Index</h4>
                    <p>${current.uv} ${getUVLevel(current.uv)}</p>
                </div>
                <div class="detail-item">
                    <h4>Visibility</h4>
                    <p>${current.vis_km} km</p>
                </div>
                <div class="detail-item">
                    <h4>Wind Direction</h4>
                    <p>${current.wind_dir}</p>
                </div>
            </div>
        </div>
        
        <div class="forecast-container">
            <h3 class="forecast-title">7-Day Forecast</h3>
            <div class="forecast-grid">
                ${forecast.slice(0, 7).map((day, index) => {
                    const date = new Date(day.date);
                    let dayName;
                    
                    if (index === 0) {
                        dayName = 'Today';
                    } else if (index === 1) {
                        dayName = 'Tomorrow';
                    } else {
                        dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    }
                    
                    const maxTemp = Math.round(day.day.maxtemp_c);
                    const minTemp = Math.round(day.day.mintemp_c);
                    const rainChance = day.day.daily_chance_of_rain;
                    const condition = day.day.condition.text;
                    
                    return `
                        <div class="forecast-item">
                            <div class="forecast-day">${dayName}</div>
                            <div style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 0.5rem;">
                                ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <img src="https:${day.day.condition.icon}" alt="${condition}" 
                                 style="width: 50px; height: 50px; margin: 10px 0;">
                            <div class="forecast-temp">
                                <div style="font-size: 1.3rem; font-weight: 700;">H:${maxTemp}°</div>
                                <div style="font-size: 1.1rem; opacity: 0.8;">L:${minTemp}°</div>
                            </div>
                            <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem; text-align: center; line-height: 1.2;">
                                ${condition}
                            </div>
                            <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 0.3rem; display: flex; align-items: center; justify-content: center; gap: 0.2rem;">
                                💧 ${rainChance}%
                                <span style="margin-left: 0.3rem;">🌬️ ${Math.round(day.day.maxwind_kph)}km/h</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function getUVLevel(uv) {
    if (uv <= 2) return '(Low)';
    if (uv <= 5) return '(Moderate)';
    if (uv <= 7) return '(High)';
    if (uv <= 10) return '(Very High)';
    return '(Extreme)';
}


function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
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
                showError('Unable to get location data');
                showSampleWeather('Your Current Location');
            }
        );
    } else {
        showError('Browser does not support location services');
    }
}

function showSampleWeather(title = 'Welcome') {
    weatherContainer.innerHTML = `<div class="loading">Welcome! Enter a city name or click the location button to see weather information.</div>`;
}

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

window.addEventListener('load', () => {
    showSampleWeather();
});
