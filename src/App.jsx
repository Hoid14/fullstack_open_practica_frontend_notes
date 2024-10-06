import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteservice from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) //guarda un objeto que tiene el token, username y name

  useEffect(() => {
    noteservice
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const handleLogin = async (event) => {
    //evita que se recargue la pagina
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user) //guarda el objeto con el token, username y name
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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
  
  const loginForm = () => ( // cuando pongo parentesis, no hay necesidad de poner return
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )
  
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {/* se utiliza para representar los formularios de manera condicional */}
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p> {/*si el usuario esta loggeado muestra su nombre en la pantalla que ya viene en el estado user*/}
          {noteForm()} {/*muestra el formulario para ingresar notas */}
        </div>
      }
      
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
      <Footer />
    </div>
  )
}


export default App
