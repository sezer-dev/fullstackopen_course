require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

const requestLogger = (request,response,next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next() //Gibt kontrolle an nächste Middleware weiter
}

const errorHandler = (error,request,response,next) => {
  console.log(error.message);


  if(error.name === 'CastError'){ //Falls es ein CAst error ist wird dieses so angezeigt
    return response.status(400).send({error:'malformatted id'});
  }
  next(error)//In allen andere Fällen wir dder error an die express error handler weitergegegeben

}


//Middleware nutzen:
app.use(express.json()) //Nötig, damit der event handler das json objekt aus dem request body lesen kann
//app.use(cors()) nicht mehr nötig, wenn frontend und backend vom selben ort aus gehostet werden
app.use(requestLogger) //muss man expres.json aufgerufen werden, damit body richtig funktioniert
app.use(express.static('dist')) //Das speichern vom Frontend als distributed version mit dem dist ordner erlaubt 
//es nun mittels express.static('dist') dass beim hochfahren des servers das backend auch direkt das Frontend mit hochlädt





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
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request,response,next) => {
  Note.findById(request.params.id).then(note => {
    if(note){response.json(note);}
    else{
      response.status(404).end(); //ID typ passt zu MongoDb id, aber existiert nicht in DB
    }
  }).catch(error => next(error))
})

app.put('api/notes/:id', (request,response,next) => {
  const {content,important} = request.body
  Note
  .findById(request.params.id)
  .then(note => {
    if(!note){ //Falls note nicht existiert
      return response.status(404).end()
    } //SOnst setze neuen content: 
    note.content = content;
    note.important = important

    return note.save().then((updatedNote) => {
      response.json(updatedNote);
    })
  }
  )
  .catch(error => next(error))

})

app.delete('/api/notes/:id', (request,response) => {
  Note
  .findByIdAndDelete(request.params.id0)
  .then(result => response.status(204).end)
  .catch(error => next(error))
})


app.post('/api/notes',
    (request, response) => {
        
        const body = request.body;

        if(!body.content){
            return response.status(400).json({error:'content missing'})
        }

        const note = new Note({
            content: body.content,
            important : body.important || false
        })

        note.save().then(savedNote => response.json(savedNote));
    })

    //Fals keiner unserer angegeben Routes stimmt wird hierfür eine Middleware geschrieben
const unkownEndpoint = (request,response) => { //Falls es also zu einer response anfrage kommt
    //ohne vorhandenn route wird eine error meldung ausgegeben
    response.status(404).send({error:'unkown endpoint'})
}
app.use(unkownEndpoint); //Muss erst nachdem alle routes definiert sind geladen werden
//Da sonst ein 404 für eine route gesneet werden würde und diese nicht mehr geladen würde

app.use(errorHandler); //Muss die letzte Middleware sein

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})