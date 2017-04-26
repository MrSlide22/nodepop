'use strict';

const mongoose = require('mongoose');

// creamos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

// creamos metodo estatico en el modelo
// para recuperar lista de agentes con filtros
anuncioSchema.statics.list = function (
    criterios, skip, limit, sort,
    callback) {

    const query = Anuncio.find(criterios);
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.exec(callback);
};

// creamos el modelo de agente
var Anuncio = mongoose.model('Anuncio', anuncioSchema);