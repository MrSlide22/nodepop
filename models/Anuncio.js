/**
 * Modelo de anuncio para acceder a la base de datos a través de mongoose
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Esquema del modelo de anuncios
 * @param {String} nombre - nombre del producto
 * @param {Boolean} venta - indica si el producto está en venta o en compra
 * @param {Number} precio - indica el precio del producto del anuncio
 * @param {String} foto - ruta de la imagen del anuncio. Se puede encontrar en /images/{foto}
 */
const anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String],
});

/**
 * Función estática para obtener los anuncios aplicando filtros
 * Todos los parámetros se aplican sobre una query de mongoose por
 * lo que si se quiere conocer más sobre el formato que tienen, leer
 * la documentación de mongoose.
 * @param {Object} criterios - criterios con los que realizar find().
 * @param {Number} skip - número de documentos a saltar en la búsqueda.
 * @param {Number} limit -limita el número de colecciones a buscar.
 * @param {String} sort - criterios de ordenación.
 */
anuncioSchema.statics.list = function (
  criterios, skip, limit, sort,
  callback) {

  const query = Anuncio.find(criterios);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.exec(callback);
};

/**
 * vincular el esquema de anuncio a una variable
 */
var Anuncio = mongoose.model('Anuncio', anuncioSchema);
