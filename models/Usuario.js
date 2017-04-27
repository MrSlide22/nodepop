/**
 * Modelo de usuario para acceder a la base de datos a través de mongoose.
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Esquema del modelo de usuario
 * @param {String} nombre - nombre del usuario
 * @param {String} email - email del usuario
 * @param {String} clave - contraseña del usuario
 * @param {String} sal - sal aplicada a la clave del usuario
 */
const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  sal: {
    type: String,
    required: true,
  },
});

/**
 * vincular el esquema de usuario a una variable
 */
mongoose.model('Usuario', usuarioSchema);
