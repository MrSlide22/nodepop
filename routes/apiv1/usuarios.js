/**
 * Controlador de las rutas referentes a los anuncios
 * Manejará las rutas que empiecen por /apiv1/:lang(es|en)?/usuarios
 */

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const crypto = require('crypto');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const CustomError = require('../../lib/CustomError');

/**
 * Pimienta utilizada en el hash de la clave del usuario
 */
const pimienta = 'NodePop';

/**
 * POST /apiv1/:lang(es|en)?/usuarios/
 * Registro de un nuevo usuario
 * @param {String} nombre - nombre del usuario
 * @param {String} email - email del usuario. Con este se autenticará el usuario
 * @param {String} clave - clave del usuario. Esta se hasheará con sal y pimienta
 */
router.post('/', (req, res, next) => {

  req.checkBody('nombre', req.__('isRequired')).notEmpty();
  req.checkBody('email', req.__('isRequired')).notEmpty();
  req.checkBody('email', req.__('emailBadFormat')).isEmail();
  req.checkBody('clave', req.__('isRequired')).notEmpty();

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const err = new CustomError(req).validation(validationErrors);
    next(err);
    return;
  }

  const datosUsuario = req.body;

  const hashSal = crypto.createHash('sha256');
  hashSal.update((new Date()).toISOString());
  datosUsuario.sal = hashSal.digest('hex');

  const hashClave = crypto.createHash('sha256');
  hashClave.update(datosUsuario.sal + datosUsuario.clave + pimienta);
  datosUsuario.clave = hashClave.digest('hex');

  console.log(datosUsuario);

  const usuario = new Usuario(datosUsuario);

  usuario.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.status(201);
    res.json({ success: true, result: req.__('user.saveSuccess') });
  });
});

/**
 * POST /apiv1/:lang(es|en)?/usuarios/authenticate
 * Autenticación del usuario
 * @param {String} email - email del usuario
 * @param {String} clave - contraseña del usuario
 * @return {String} token para acceder al resto de recursos
 */
router.post('/authenticate', (req, res, next) => {

  const email = req.body.email;
  const clave = req.body.clave;

  req.checkBody('email', req.__('isRequired')).notEmpty();
  req.checkBody('email', req.__('emailBadFormat')).isEmail();
  req.checkBody('clave', req.__('isRequired')).notEmpty();

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const err = new CustomError(req).validation(validationErrors);
    next(err);
    return;
  }

  Usuario.findOne({ email: email }).exec((err, usuario) => {
    if (err) {
      next(err);
      return;
    }

    if (!usuario) {
      const err = new CustomError(req).user.badCredentials;
      next(err);
      return;
    }

    const hash = crypto.createHash('sha256');
    hash.update(usuario.sal + clave + pimienta);
    const claveHash = hash.digest('hex');

    if (usuario.clave !== claveHash) {
      const err = new CustomError(req).user.badCredentials;
      next(err);
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
