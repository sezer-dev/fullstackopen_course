const mongoose = require('mongoose')

if(process.argv.length< 3){ //STellt sicher, dass password eingegebn wird, da das password zusätzlich beim befehl aufruf angehängt wird und damit in process.argv[2] liegt
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2] //Gibt den command zeilen code aus

const url= `mongodb+srv://fullstack:${password}@cluster0.lkjgb3l.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url); //VErbindung zur Datenbank aufbauen

const noteShema = new mongoose.Schema({ //Erzeuge ein Schema für die Daten
    content: String,
    important : Boolean
})

const Note = mongoose.model('Note',noteShema); //Erzeuge Objekte, welche dem borher erzuegtem Schema folgen sollen

const note = new Note({ //Erzeuge ein erstes Note Objekt
    content: 'HTML is easy',
    important:true
})

/*
note.save().then(result => {
    console.log('note saved!');
    mongoose.connection.close();
})
    */

Note.find({important:true}).then(result => {
    result.forEach(note => console.log(note));
    mongoose.connection.close();
}
)