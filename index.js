const express = require('express')
const app = express()
const cors = require('cors')

const requestLogger = (request,response,next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next() //Gibt kontrolle an nächste Middleware weiter
}
//Middleware nutzen:
app.use(express.json()) //Nötig, damit der event handler das json objekt aus dem request body lesen kann
app.use(cors())
app.use(requestLogger) //muss man expres.json aufgerufen werden, damit body richtig funktioniert

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
//Get nimmt eine Route und einen event handler entgegen:
app.get('/', (request, response) => { //Routes um get reuqest für standardadresse zu definieren
    //request enthält alle Informationen zur HTTP ANfrage
    //response definiert, wie man auf den Request antwortet
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request,response) => {
    const id = request.params.id //:id packt alles was nach / geschrieben wird in id rein, auch strings, etc
    console.log(id)
    const note = notes.find(note => note.id ===id)
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
    })

app.delete('/api/notes/:id', (request,response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !==id);

    response.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))):0;
    return String(maxId+1);
}

app.post('/api/notes',
    (request, response) => {
        
        const body = request.body;

        if(!body.content){
            return response.status(400).json({error:'content missing'})
        }

        const note = {
            content: body.content,
            important : body.important || false,
            id: generateId(),
        }

        
        notes = notes.concat(note)
        response.json(note);
    })

    //Fals keiner unserer angegeben Routes stimmt wird hierfür eine Middleware geschrieben
const unkownEndpoint = (request,response) => { //Falls es also zu einer response anfrage kommt
    //ohne vorhandenn route wird eine error meldung ausgegeben
    response.status(404).send({error:'unkown endpoint'})
}
app.use(unkownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})