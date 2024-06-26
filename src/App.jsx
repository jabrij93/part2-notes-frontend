import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteService from './services/noteService'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNotes] = useState('add a new note..')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    noteService 
      .getAll()
      .then(initialNotes => {
        console.log('Fetched notes:', initialNotes)
        setNotes(initialNotes)
      })
  }, [])
  console.log('INSPECT NOTES', notes)
  console.log('render', notes.length, 'notes')
  // console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNotes('')
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNotes(event.target.value)    
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
  console.log('Notes to show:', notesToShow)


  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
        .then(returnedNote => { 
          setNotes(notes.map(note => note.id === id ? returnedNote : note)) 
        })
        .catch(error=> {
          alert(`the note '${note.content}' was already deleted from server`)
          setNotes(notes.filter(n => n.id === id ))
        })

    console.log(`importance of ${id} needs to be toggled`)
  }

  return (
    <div>
      <h1>Notes</h1> 
      <button onClick={() => setShowAll(!showAll)}>Show {showAll ? 'important' : 'all' } </button>
      <ul>
        {Array.isArray(notesToShow) && notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App