'use strict';

const mongoose = require('mongoose');

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

mongoose.model('Usuario', usuarioSchema);
