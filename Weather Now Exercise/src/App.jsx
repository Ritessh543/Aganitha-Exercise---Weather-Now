import React, { useState } from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiStrongWind,
  WiThunderstorm,
  WiSnow,
} from "react-icons/wi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch weather function
  const fetchWeather = async () => {
    try {
      if (!city.trim()) {
        setError("Please enter a city 🌍");
        return;
      }
      setError("");
      setWeather(null);
      setLoading(true);

      // Step 1: Get lat/lon from city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found ❌");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather from lat/lon
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country: country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("Something went wrong ⚠️");
    } finally {
      setLoading(false);
    }
  };

  // pick weather icon
  const getWeatherIcon = (code) => {
    if (code === 0) return <WiDaySunny className="text-yellow-400 text-7xl" />;
    if (code >= 1 && code <= 3)
      return <WiCloud className="text-gray-200 text-7xl" />;
    if (code >= 51 && code <= 67)
      return <WiRain className="text-blue-300 text-7xl" />;
    if (code >= 71 && code <= 77)
      return <WiSnow className="text-cyan-200 text-7xl" />;
    if (code >= 95)
      return <WiThunderstorm className="text-purple-500 text-7xl" />;

    return <WiDaySunny className="text-orange-400 text-7xl" />;
  };

  // dynamic background
  const getBackground = () => {
    if (!weather) return "from-blue-400 via-indigo-500 to-blue-600";
    const code = weather.weathercode;

    if (code === 0) return "from-yellow-200 via-orange-300 to-pink-400"; // sunny
    if (code >= 1 && code <= 3) return "from-gray-400 via-gray-500 to-gray-700"; // cloudy
    if (code >= 51 && code <= 67) return "from-blue-700 via-blue-800 to-gray-900"; // rain
    if (code >= 71 && code <= 77) return "from-blue-200 via-cyan-200 to-white"; // snow
    if (code >= 95) return "from-purple-800 via-purple-900 to-black"; // thunderstorm

    return "from-blue-400 via-indigo-500 to-blue-600";
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-r ${getBackground()} p-6 transition-colors duration-700`}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white drop-shadow-lg animate-pulse">
        🌤️ Weather Now
      </h1>

      {/* Search Box */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border-none shadow-md focus:ring-2 focus:ring-yellow-400 outline-none text-gray-700"
        />
        <button
          onClick={fetchWeather}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-700 font-semibold bg-white/80 px-4 py-2 rounded-xl shadow">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-white font-medium animate-bounce">
          Fetching weather ⏳...
        </p>
      )}

      {/* Weather Card */}
      {weather && (
        <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-3xl p-8 text-center w-full max-w-sm text-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          <div className="flex justify-center animate-fadeIn">
            {getWeatherIcon(weather.weathercode)}
          </div>
          <h2 className="text-2xl font-bold mt-3 tracking-wide">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-5xl font-extrabold mt-2">
            {weather.temperature}°C
          </p>
          <p className="flex justify-center items-center gap-2 mt-3 text-lg font-medium">
            <WiStrongWind className="text-cyan-300 text-3xl animate-spin-slow" />
            {weather.windspeed} km/h
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
