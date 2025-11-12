import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()
    const existing = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existing) {
      if (window.confirm(`${existing.name} is already in the phonebook, replace the old number?`)) {
        const updatedPerson = { ...existing, number: newNumber }
        personService.update(existing.id, updatedPerson).then(returned => {
          setPersons(persons.map(p => p.id !== existing.id ? p : returned))
        })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService.create(newPerson).then(returned => {
      setPersons(persons.concat(returned))
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(p => (
          <li key={p.id}>
            {p.name} {p.number}
            <button onClick={() => deletePerson(p.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
