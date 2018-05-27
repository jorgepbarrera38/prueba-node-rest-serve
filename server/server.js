require('./config/config')

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const bodyParser = require('body-parser')

//Habilitar el public
app.use(express.static(path.resolve(__dirname,('../public'))))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.use(require('./routes'))

mongoose.connect(process.env.urlDB, (err, res) => {
    if (err) throw err;
    console.log('Conexión exitosa')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto '+ process.env.PORT)
})