'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const crypto = require('crypto');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const pimienta = 'NodePop';

router.post('/', (req, res, next) => {

  const datosUsuario = req.body;

  const hashSal = crypto.createHash('sha256');
  hashSal.update((new Date()).toISOString());
  datosUsuario.sal = hashSal.digest('hex');

  const hashClave = crypto.createHash('sha256');
  hashClave.update(datosUsuario.sal + datosUsuario.clave + pimienta);
  datosUsuario.clave = hashClave.digest('hex');

  const usuario = new Usuario(datosUsuario);

  usuario.save((err, usuarioCreado) => {
    if (err) {
      next(err);
      return;
    }

    res.status(201);
    res.json({ success: true, result: req.__("user.saveSuccess") });
  });
});

router.post('/authenticate', (req, res, next) => {

  // recibimos credenciales
  const email = req.body.email;
  const clave = req.body.clave;

  // buscamos el usuario en la base de datos
  Usuario.findOne({ email: email }).exec((err, usuario) => {
    if (err) {
      next(err);
      return;
    }

    const hash = crypto.createHash('sha256');
    
    hash.update(usuario.sal + clave + pimienta);
    const claveHash = hash.digest('hex');

    if (!usuario || usuario.clave !== claveHash) {
      res.status(403);
      res.json({ success: false, error: req.__("user.badCredentials") });
      return;
    }

    // Creamos un token JWT
    jwt.sign({ usuario_id: usuario._id }, config.jwtSecret, config.jwtConfig,
      (err, token) => {
        if (err) {
          next(err);
          return;
        }

        // Se lo devolvemos
        res.json({ success: true, token: token });
      }
    );
  });
});

module.exports = router;
