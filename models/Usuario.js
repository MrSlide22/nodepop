'use strict';

const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: {
        type: String,
        index: true
    },
    clave: String,
    sal: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);