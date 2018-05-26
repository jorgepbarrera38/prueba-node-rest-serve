require('./config/config')

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.use(require('./routes/usuario'))
console.log(process.env.urlDB)
mongoose.connect(process.env.urlDB, (err, res) => {
    if (err) throw err;
    console.log('Conexión exitosa')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto '+ process.env.PORT)
})