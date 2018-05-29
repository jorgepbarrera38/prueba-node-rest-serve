const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400).json({ok:false, message:'No se ha seleccionado ningún archivo'})
    }

    let tiposValidos = ['productos', 'usuarios']

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({ok: false, message: 'Los tipos permitidos son '+tiposValidos.join(', ')})
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    
    //Extensiones permitidas
    let extensionesValidas = ['jpg', 'jpeg', 'gif', 'png']

    if (extensionesValidas.indexOf(extension)<0) return res.status(400).json({ok: false, message: 'El archivo debe ser de tipo imagen'})

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=>{
        if (err) return res.status(500).json({ok: false, err})

        //Imagen cargada
        if(tipo==='usuarios'){
            imagenUsuario(id, res, nombreArchivo)
        }else{
            imagenProducto(id, res, nombreArchivo)
        }
       
    })
})

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB)=>{
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({ok: false, err})
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({ok: false, message: 'Usuario no existe'})
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioUPDATED)=>{
            if (err) return res.status(500).json({ok: false, err})
            return res.status(200).json({ok: true, message: 'Imagen de usuario subida'})
        })
    })
}

function imagenProducto(id, res, nombreArchivo){
        Producto.findById(id, (err, productoDB)=>{
        if (err) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({ok: false, err})
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({ok: false, message: 'Producto no existe'})
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo
        productoDB.save((err, productoUPDATED)=>{
            if (err) return res.status(500).json({ok: false, err})
            return res.status(200).json({ok: true, message: 'Imagen de producto subida'})
        })
    })
}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app