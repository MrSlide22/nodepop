'use strict';

const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);