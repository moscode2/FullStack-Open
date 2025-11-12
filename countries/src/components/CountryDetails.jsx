import { useEffect, useState } from "react";
import axios from "axios";

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_KEY;
  const capital = country.capital?.[0];

  useEffect(() => {
    if (!capital) return;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => setWeather(response.data))
      .catch(error => console.error("Weather fetch failed:", error));
  }, [capital, api_key]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h4>Languages:</h4>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="120" />

      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
};

export default CountryDetails;
