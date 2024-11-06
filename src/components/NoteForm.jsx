import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('') //el estado que maneja el input de note

  const addNote = (event) => {
    event.preventDefault()
    createNote({ //se le pasa la funcion createNote desde el componente App que recibe una nota
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div className='formDiv'>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          placeholder='write note content here'
        />
        <input
          value
          onChange
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm