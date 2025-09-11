import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'
import './index.css'

const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  const notes = response.data;
  console.log(response); //UM das ergebnis eines promises zu erhalten, muss man einen event handler nutzen

  



})

//Die callback Funktion wird mit then registriert und erhält ein response objekt,
//welches alle wichtigen ANtworten einer HTTP GET ANfrage enthält (Daten, Statuscode, ...)


ReactDOM.createRoot(document.getElementById('root')).render(
  <App/>)

