import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteservice from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('null')

  useEffect(() => {
    noteservice
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceof = (id) => {
    const note = notes.find(n=>n.id ===id)
    const changedNote = {...note, important: !note.important}

    noteservice
    .update(id,changedNote)
    .then(returnedNNote=>{
      setNotes(notes.map(n => n.id !== id ? n:returnedNNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
      setNotes(notes.filter(n => n.id !==id))
    })
  }

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
  
  
    noteservice
      .create(noteObject)
      .then(returnedNNote => {
        setNotes(notes.concat(returnedNNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) =>{
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important ===true)
  
  
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note=>(
            <Note
            key={note.id} 
            note={note}
            toggleImportance={()=>toggleImportanceof(note.id)}
            />
        ))}
        
      </ul>
      <form onSubmit={addNote}>
        <input 
          value= {newNote}
          onChange={handleNoteChange}  
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}


export default App
