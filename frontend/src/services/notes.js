import axios from 'axios'

//const baseUrl = 'https://render-test-lgo7.onrender.com/api/notes'
const baseUrl = '/api/notes' //Da nun das Frontend als auch Backend auf der sleben adressse gehostet werden,
//kann man einen relativen Pfad nutzen

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
}

const create = newObject => {
    return axios.post(baseUrl,newObject).then(response => response.data);
}

const update = (id,newObject) => {
    return axios.put(`${baseUrl}/${id}`,newObject).then(response => response.data);
}

export default {getAll,create,update}

/*
const name = 'Leevi'
const age = 0
--------------

const person = {
  name: name,
  age: age
}
beides führt zum gleichen Ergebnis 

const person = { name, age }
*/