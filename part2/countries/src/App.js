import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchResults = ({ countries, isSearching }) => {
  if (!isSearching) {
    return false;
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length === 1) {
    const country = countries[0];
    return (
      <>
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
      </>
    );
  }

  return (
    <div>
      {countries.map((country) => (
        <p key={country.name}>{country.name}</p>
      ))}
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

  return (
    <div>
      Find countries{' '}
      <input onChange={handleSearchCountries} value={countrySearchTerm} />
      <SearchResults
        countries={countrySearchResults}
        isSearching={countrySearchTerm !== ''}
      />
    </div>
  );
};

export default App;
