require('./config/config')

const express = require('express')
const app = express()
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('Get')
})
 
app.post('/usuario', function (req, res) {
    let body = req.body
    res.status(200).json(body)
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    res.json({id})
})

app.delete('/usuario/:id', function (req, res) {
    res.json('Delete')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto '+ process.env.PORT)
})