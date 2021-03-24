import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = ({ city }) => {
  const [weather, setWeather] = useState([]);
  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHERSTACK_API_ACCESS_KEY}&query=${city}`
      )
      .then((response) => setWeather(response.data.current));
  }, [city]);

  if (weather.length === 0) return false;

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>
        <strong>Temperature:</strong> {weather.temperature} Celcius
      </p>
      <p>
        <img
          src={weather.weather_icons[0]}
          alt={weather.weather_descriptions[0]}
        />
      </p>
      <p>
        <strong>Wind:</strong> {weather.wind_speed} mph direction{' '}
        {weather.wind_dir}
      </p>
    </div>
  );
};

const CountryDetails = ({ country }) => {
  if (!country) return false;
  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital {country.capital}</p>
      <p>Population {country.population}</p>

      <h2>Languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>

      <img src={country.flag} alt={country.name} width="100" />

      <Weather city={country.capital} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then((response) => setCountries(response.data));
  }, []);

  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [countrySearchResults, setCountrySearchResults] = useState([]);
  const handleSearchCountries = (event) => {
    let searchTerm = event.target.value;
    setCountrySearchTerm(searchTerm);
    setCountrySearchResults(
      countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  let results;
  if (countrySearchResults.length > 10 && countrySearchTerm) {
    results = <p>Too many matches, specify another filter</p>;
  } else if (countrySearchResults.length === 1) {
    results = <CountryDetails country={countrySearchResults[0]} />;
  } else if (countrySearchTerm) {
    results = countrySearchResults.map((country) => (
      <p key={country.name}>
        {country.name}{' '}
        <button
          onClick={() => {
            setCountrySearchResults([country]);
            setCountrySearchTerm('');
          }}
        >
          Show
        </button>
      </p>
    ));
  }

  return (
    <div>
      Find countries{' '}
      <input onChange={handleSearchCountries} value={countrySearchTerm} />
      {results}
    </div>
  );
};

export default App;
