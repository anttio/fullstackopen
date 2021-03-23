import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
