/**
 * Controlador de las rutas referentes a los anuncios
 * Manejará las rutas que empiecen por /apiv1/:lang(es|en)?/anuncios
 */

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');

const jwtAuth = require('../../lib/jwtAuth');
const CustomError = require('../../lib/CustomError');
router.use(jwtAuth);

/**
 * GET /apiv1/:lang(es|en)?/anuncios/
 * Devuelve el listado de anuncios aplicando los filtros proporcionados
 * a traves de la query string
 * Parámetros del body:
 * @param {String[,String...]} tag - etiquetas de los anuncios
 * @param {String} nombre - nombre del producto del anuncio. Devolverá
 * todos los que empiecen por el nombre proporcionado
 * @param {[Numbre]-[Number]} precio - Rango de precios de los anuncios Min-Max.
 * Se puede omitir uno de los dos extremos.
 *
 * Token en header, body o query string:
 * @param {String} token - si va en el header se llamará x-access-token
 */
router.get('/', function (req, res, next) {

  const tag = req.query.tag;
  const nombre = req.query.nombre;
  const venta = req.query.venta;
  const precio = req.query.precio;
  let limit = parseInt(req.query.limit);
  let skip = parseInt(req.query.start);
  let sort = req.query.sort;

  const criterios = {};

  if (tag) {
    const tags = tag.split(',');

    const validTags = ['work', 'lifetyle', 'motor', 'mobile'];

    let invalidTag = false;
    tags.forEach((element) => {
      if (validTags.indexOf(element) === -1) {
        invalidTag = true;
      }
    });

    if (invalidTag) {
      const err = new CustomError(req).tag.invalid;
      next(err);
      return;
    }

    criterios.tags = {};
    criterios.tags.$in = tags;
  }

  if (nombre) {
    criterios.nombre = {};
    criterios.nombre.$regex = new RegExp('^' + nombre, 'i');
  }

  if (venta) {
    criterios.venta = venta;
  }

  if (precio) {
    const range = precio.split('-');

    if (range.length > 1) {

      criterios.precio = {};

      if (range[0] !== undefined && range[0] !== '') {
        criterios.precio.$gte = parseInt(range[0]);
      }

      if (range[1] !== undefined && range[1] !== '') {
        criterios.precio.$lte = parseInt(range[1]);
      }
    } else {
      criterios.precio = parseInt(range[0]);
    }
  }

  if (sort) {

    sort = sort.replace(',', ' ');
  }

  Anuncio.list(criterios, skip, limit, sort, (err, anuncios) => {
    if (err) {
      next(err);
      return;
    }

    res.json({ success: true, result: anuncios });
  });
});

/**
 * GET /apiv1/:lang(es|en)?/anuncios/tags
 * Devuelve las etiquetas de los anuncios que aparecen
 * en la base de datos
 *
 * Token en header, body o query string:
 * @param {String} token - si va en el header se llamará x-access-token
 */
router.get('/tags', (req, res, next) => {

  Anuncio.find({}, 'tags', (err, tags) => {

    if (err) {
      next(err);
      return;
    }

    const reduceTags = tags.reduce((acum, elem) => acum.tags.concat(elem.tags));

    const uniqueTags = reduceTags.filter((item, pos, self) => self.indexOf(item) == pos);

    res.json({ success: true, result: uniqueTags });
  });
});

module.exports = router;
