import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'
import Footer from './components/Footer'


const Notification = ({message}) => {
  if(message === null){
    return null;
  }
  return(
    <div className='error'>{message}</div>
  )
}

const App = () => {

  const [notes,setNotes] = useState([]);
  const [newNote,setNewNote] = useState('a new note ...');
  const[showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...")

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const hook = ()=> {
    noteService
        .getAll()
        .then(initialNotes => {
          console.log('promise fulfilled');
          setNotes(initialNotes)
        })
  };

  useEffect(hook,[]);

  console.log('render',notes.length,'notes');

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }
    noteService
        .create(noteObject)
        .then(returnedNote => {
           setNotes(notes.concat(noteObject));
            setNewNote('');
        });

   
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote:note))})
      .catch(error => {
        setErrorMessage(`Note ${note.content} was already removed from server`);
        setTimeout(()=> setErrorMessage(null),5000);
        setNotes(notes.filter(n => n.id !== id));
      })
  }


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}></Notification>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important':'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
           <Note key={note.id} note={note} 
           toogleImportance={() => toggleImportanceOf(note.id)}></Note>
           )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer></Footer>
    </div>
  )
}

export default App