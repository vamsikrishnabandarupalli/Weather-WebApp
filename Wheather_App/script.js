const API_KEY = "53f9387f9cfe7c4e750729557058f3e0"; // Replace with your OpenWeatherMap API key
let currentUnit = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit

document.getElementById("weatherForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const city = document.getElementById("cityInput").value;
    fetchWeatherByCity(city);
});

document.getElementById("getLocation").addEventListener("click", function () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            document.getElementById("errorMessage").textContent = "Geolocation permission denied.";
        });
    } else {
        document.getElementById("errorMessage").textContent = "Geolocation is not supported.";
    }
});

document.getElementById("toggleUnit").addEventListener("click", function () {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    this.textContent = `Switch to ${currentUnit === "metric" ? "°F" : "°C"}`;
    if (document.getElementById("weatherDisplay").style.display !== "none") {
        const city = document.getElementById("cityName").textContent;
        fetchWeatherByCity(city);
    }
});

function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}`;
    fetchWeather(url);
}

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;
    fetchWeather(url);
}

function fetchWeather(url) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("errorMessage").textContent = "";

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            document.getElementById("loading").style.display = "none";
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            document.getElementById("errorMessage").textContent = error.message;
            document.getElementById("weatherDisplay").style.display = "none";
        });
}

function displayWeather(data) {
    document.getElementById("weatherDisplay").style.display = "block";
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°${currentUnit === "metric" ? "C" : "F"}`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("condition").textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}
