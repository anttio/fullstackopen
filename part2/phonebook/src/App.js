import React, { useEffect, useState } from 'react';
import personService from './services/persons';

const Alert = ({ message, type }) => {
  if (!message) {
    return false;
  }

  const alertSuccess = {
    backgroundColor: '#D6F6E2',
    color: '#1D8547',
    padding: '8px 16px',
    marginBottom: 16,
    borderRadius: 10,
    fontWeight: 'bolder',
  };

  const alertError = {
    backgroundColor: '#FFDFDF',
    color: '#F53636',
    padding: '8px 16px',
    marginBottom: 16,
    borderRadius: 10,
    fontWeight: 'bolder',
  };

  return (
    <div style={type === 'error' ? alertError : alertSuccess}>
      <p>{message}</p>
    </div>
  );
};

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
              <input onChange={field.handler} value={field.value} />
            </label>
          </div>
        );
      })}
      <button type="submit">Add</button>
    </form>
  );
};

const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}{' '}
          <button onClick={() => removePerson(person)}>Delete</button>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const [filterTerm, setFilterTerm] = useState('');
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const [alert, setAlert] = useState({});

  const addNewPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson(existingPerson);
      }
      return;
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        handleAlertMessage({
          type: 'success',
          message: `Added ${returnedPerson.name}`,
        });
      });
  };

  const updatePerson = (updatePerson) => {
    personService
      .update(updatePerson.id, { ...updatePerson, number: newNumber })
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id !== updatePerson.id ? person : returnedPerson
          )
        );
      });
  };

  const removePerson = (removePerson) => {
    if (window.confirm(`Delete ${removePerson.name}?`)) {
      personService
        .remove(removePerson.id)
        .then(
          setPersons(persons.filter((person) => person.id !== removePerson.id))
        );
    }
  };

  const handleAlertMessage = (message) => {
    setAlert({
      type: message.type,
      message: message.message,
    });
    setTimeout(() => {
      setAlert({});
    }, 5000);
  };

  const handleFilterChange = (event) => {
    setFilterTerm(event.target.value);
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
      <Alert message={alert.message} type={alert.type} />

      <Filter handleChange={handleFilterChange} value={filterTerm} />

      <h2>Add a new</h2>
      <PersonForm
        fields={[
          { label: 'Name', value: newName, handler: handleNameChange },
          { label: 'Number', value: newNumber, handler: handleNumberChange },
        ]}
        handleSubmit={addNewPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
