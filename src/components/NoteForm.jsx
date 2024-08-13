import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')
  const [newNote2, setNewNote2] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })
    setNewNote('')
  }

    return (
      <div className="formDiv">
        <h2>Create a new note</h2>
        <form onSubmit={addNote}>
          <input
            value={newNote}
            onChange={event => setNewNote(event.target.value)}
            id='note-input'
          />
          <input
            value={newNote2}
            onChange={event => setNewNote2(event.target.value)}
          />
          <button type="submit">save</button>
        </form>
      </div>
    )
}

export default NoteForm