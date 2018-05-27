
const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(400).json({ ok:false, message: 'Token no válido' })
        req.usuario = decoded.usuario
        next()
    })

}

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok:false,
            message: 'No tienes permisos'
        })
    }else {
        next()
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}