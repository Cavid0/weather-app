# Weather App

A modern and stylish web application providing real-time weather information with a sleek interface.


## 🌟 Features

*   **Real-Time Weather:** Current temperature, feels like, humidity, wind speed, pressure, and UV index.
*   **7-Day Forecast:** Detailed weather forecast for the upcoming week.
*   **City Search:** Get weather information by searching for any city name.
*   **Current Location Support:** Automatically detect your location via GPS (Geolocation).
*   **Glassmorphism Design:** Modern interface with a frosted glass effect and gradient background.
*   **Responsive Design:** Looks great on both desktop and mobile devices.

## 🛠️ Technologies

*   **HTML5** - Structure
*   **CSS3** - Styling & Animations (Glassmorphism)
*   **JavaScript (ES6+)** - Logic & DOM Manipulation
*   **WeatherAPI** - Weather data provider

## 🚀 How to Run

1.  Clone the repository:
    ```bash
    git clone https://github.com/Cavid0/weather-app.git
    ```
2.  Navigate to the directory:
    ```bash
    cd weather-app
    ```
3.  Open `weather.html` in your browser.

## ⚙️ Configuration (API Key)

This project uses **[WeatherAPI](https://www.weatherapi.com/)**. You need your own API key to run it locally.

1.  **Get a Key:** Sign up at [WeatherAPI.com](https://www.weatherapi.com/) (Free plan works).
2.  **Setup Config:**
    *   Rename `config.example.js` to `config.js`.
    *   Open `config.js` and replace `"YOUR_API_KEY_HERE"` with your actual key.
    ```javascript
    const API_KEY = "your_actual_api_key_here";
    ```
    *(Note: `config.js` is ignored by Git to keep your key safe.)*

3.  **Run:** Open `weather.html`.

## 👨‍💻 Author

**Cavid** - *Developer*

---
*Created with ❤️ by Cavid*
