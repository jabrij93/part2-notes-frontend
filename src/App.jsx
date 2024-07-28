import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/noteService';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';


const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('add a new note..');
  const [showAll, setShowAll] = useState(true);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(null);
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const user = await loginService.login({
        username, 
        password,
      });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      noteService.setToken(user.token);
        setUser(user);
        setUsername('');
        setPassword('');
        setNotifications({ message: `Logging in as ${username}`, type: 'success' });
    } catch (exception) {
        setNotifications({ message: 'Wrong credentials', type: 'error' });
    }

    setTimeout(() => {
      setNotifications(null);
    }, 5000);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
    setUsername('');
    setPassword('');
    setNotifications({ message: 'User logged out', type: 'info' });
    setTimeout(() => {
      setNotifications(null);
    }, 5000);
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note));
    }).catch(error => {
      alert(`The note '${note.content}' was already deleted from server`);
      setNotes(notes.filter(n => n.id !== id));
    });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notifications?.message} type={notifications?.type} />
      {user === null ? (
        <div>
          <div style={{ display: loginVisible ? 'none' : '' }}>
            <button onClick={() => setLoginVisible(true)}>log in</button>
          </div>
          <div style={{ display: loginVisible ? '' : 'none' }}>
          <Togglable buttonLabel='Login'> 
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
              {/* <button onClick={() => setLoginVisible(false)}>cancel</button> */}
            </Togglable>
          </div>
        </div>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Toggleable buttonLabel='test' />
          <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">save</button>
          </form>
        </div>
      )}
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map(note => (
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
