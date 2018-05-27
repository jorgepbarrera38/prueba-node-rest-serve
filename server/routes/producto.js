const express = require('express')
const app = express()

const { verificaToken } = require('../middlewares/autenticacion')
let Producto = require('../models/producto')

app.get('/productos', verificaToken, (req, res)=>{
    let desde = req.query.desde || 0
    desde = Number(desde)
    Producto.find({}).populate('usuario', 'nombre email').populate('categoria').skip(desde).limit(7).exec((err, productos)=>{
        if (err) return res.json({ok:false, err})
        Producto.count((err, count)=>{
            res.status(200).json({
                ok: true, 
                productos,
                count
            })
        });
    })
})

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex }).populate('categoria', 'nombre').exec((err, productos)=>{
        if (err) return res.json({ok:false, err})
        res.json({
            ok: true, 
            productos
        })
    })
})

app.get('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id
    Producto.findById(id, (err, productoDB)=>{
        if (err) res.status(500).json({ok:false, err})
        if (!productoDB) return res.status(404).json({ok:true, message:'El producto no existe'})
        res.json({
            ok: true, 
            producto: productoDB
        })
    })
})

app.post('/productos', verificaToken, (req, res)=>{
    let body = req.body

    producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //disponible: body.nombre,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoSAVED)=>{
        if (err) return res.status(500).json({ok:false, err})
        res.json({
            ok: true, 
            productoSAVED
        })
    })
})

app.put('/productos/:id', verificaToken, (req, res)=>{
    let body = req.body;
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, body, (err, productoUPDATED)=>{
        if (err) return res.status(500).json({ok:false, err})
        res.json({
            ok:true, 
            productoUPDATED
        })
    });
})

app.delete('/productos/:id', (req, res)=>{
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDELETED)=>{
        if (err) return res.status(500).json({ok:false, err})
        if (!productoDELETED) return res.json({ok:false, message:'El producto no existe'})
        res.json({
            ok:true,
            message: 'Producto eliminado'
        })
    }) 
})

module.exports = app