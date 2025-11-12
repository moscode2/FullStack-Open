import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Fetch all persons from backend
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Failed to fetch persons:', error)
      })
  }, [])

  // Add or update person
  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existing) {
      const confirmUpdate = window.confirm(
        `${existing.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existing, number: newNumber }
        personService
          .update(existing.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`The person '${existing.name}' was already deleted from server`)
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error adding person:', error)
      })
  }

  // Delete person
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The person '${person.name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
      </form>
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(p => (
          <li key={p.id}>
            {p.name} {p.number} {' '}
            <button onClick={() => deletePerson(p.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
