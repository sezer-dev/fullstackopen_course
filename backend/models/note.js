const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI //Nutze Enviorment Varibalen zur URL Speicherung

console.log('connection to', url)

mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('error connectiong to MongoDB:', error.message)
})

const noteSchema = new mongoose.Schema({
    content:{
      type:String,
      minLength:5,
      required:true
    },
    important: Boolean,
})


noteSchema.set('toJSON',{ //Formatiere die erzeugte Json aus den Daten, so dass sie nicht __v anzeigt 
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() //Ändere die interne id von MongoDb zu id
    delete returnedObject._id //Lösche ansicht der internen id
    delete returnedObject.__v //Lösche --v wert
  } //Wenn nun notes mit der methode .json(notes) aufgerufen werden, wird diese transofmrarion angewandt
})


module.exports = mongoose.model('Note', noteSchema);