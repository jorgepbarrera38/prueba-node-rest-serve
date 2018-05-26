const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const app = express()
const Usuario = require('../models/usuario')

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0

    desde = Number(desde)

    

    Usuario.find({ state:true }, 'nombre email role state google img').skip(desde).limit(5).exec((err, usuarios)=>{
        if (err) return res.status(400).json({ok:false, err})
        Usuario.count({state:true}, (err, conteo)=>{
            res.json({
                ok: true,
                usuarios,
                conteo
            })
        })
    })
})
   
app.post('/usuario', function (req, res) {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    })

    usuario.save((err, usuarioCreated)=>{
        if (err) return res.status(400).json({ok:false, err})
        usuarioCreated.password = null
        res.status(200).json({ok:true, usuario:usuarioCreated})
    })

    
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    console.log(id)
    let body =req.body

    Usuario.findByIdAndUpdate(id, body, {new:true}, (err, usuarioDB) => {
    
        if (err) return res.status(400).json({ok:false, err})
        res.json({
            ok: true, 
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id
    Usuario.findByIdAndUpdate(id, {state: false}, (err, usuarioEliminado)=>{
        if (err) return res.status(400).json({ok:false, err})
        if (!usuarioEliminado) return res.status(404).json({ok:false, error:{message: 'El usuario no existe'}})
        res.status(200).json({
            ok: true,
            usuarioEliminado
        })
    })

})

module.exports = app