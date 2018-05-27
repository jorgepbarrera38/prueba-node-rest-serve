
const express = require('express')
const app = express()
let { verificaToken } = require('../middlewares/autenticacion')
let Categoria = require('../models/categoria')


app.get('/categoria', verificaToken, (req, res) =>{
    Categoria.find({}).populate('usuario', 'nombre email').sort('descripcion').exec((err, categoriasDB) => {
        if (err) return res.status(500).json({ok:false, message: 'Error interno del servidor'})
        if (!categoriasDB) return res.status(404).json({ok:false, message: 'No hay categorias registradas'})
        Categoria.count((err, conteo)=>{
            res.json({
                ok: true,
                categorias: categoriasDB,
                totalCategorias: conteo
            })
        })
    })
    
})

app.get('/categoria/:id', verificaToken, (req, res) =>{
    let id = req.params.id;
    Categoria.findById(id, (err, categoria)=>{
        if (err) return res.status(500).json({ok:false, err});
        if (!categoria) return res.status(404).json({ok:false, message:'No existe la categoría'})
        res.status(200).json({
            ok: true,
            categoria
        })
    })
})

app.post('/categoria', verificaToken, (req, res)=>{
    let body = req.body
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaCREATED)=>{
        if (err) return res.status(500).json({ok:false, message: err})
        if (!categoriaCREATED) return res.json({ok:false, err})
        res.json({
            ok: true,
            categoriaCREATED
        })
    })
})

app.put('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id
    let body = req.body
    Categoria.findByIdAndUpdate(id, body, (err, categoriaUPDATED)=>{
        if (err) return res.status(500).json({ok:false, err})
        res.json({
            ok: true,
            categoriaUPDATED
        })
    })
})

app.delete('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDELETED)=>{
        if (err) return res.json({ok:false, err})
        res.status(200).json({
            ok: true, 
            categoriaDELETED
        })
    });
})

module.exports = app