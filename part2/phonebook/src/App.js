import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      Filter shown with <input value={value} onChange={handleChange} />
    </div>
  );
};

const PersonForm = ({ fields, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        return (
          <div key={field.label}>
            <label>
              {field.label}
              <input value={field.value} onChange={field.handler} />
            </label>
          </div>
        );
      })}
      <button type="submit">Add</button>
    </form>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const [persons, setPersons] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => setPersons(response.data));
  }, []);

  const [filteredPersons, setFilteredPersons] = useState(persons);
  useEffect(() => {
    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
    );
  }, [newFilter, persons]);

  const addNewPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const person = {
      name: newName,
      number: newNumber,
    };

    axios.post('http://localhost:3001/persons', person).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName('');
      setNewNumber('');
    });
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter value={newFilter} handleChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        fields={[
          { label: 'Name', value: newName, handler: handleNameChange },
          { label: 'Number', value: newNumber, handler: handleNumberChange },
        ]}
        handleSubmit={addNewPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
