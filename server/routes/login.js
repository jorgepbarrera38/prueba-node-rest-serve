
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const app = express()


app.post('/login', (req, res) => {
    let body = req.body;
    
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) return res.status(500).json({ok: false, err})
        if (!usuarioDB) return res.status(400).json({ok: false, err: { message: 'Error email' }})
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({ok: false, err: { message: 'Error password' }})
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

app.post('/google', (req, res) => {
    let token = req.body.idtoken
    res.json({
        body: req.body
    })
})

//Tus credenciales no coinciden con nuestros registros

module.exports = app