'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');

const jwtAuth = require('../../lib/jwtAuth');
const CustomError = require('../../lib/CustomError');
router.use(jwtAuth);

router.get('/', function (req, res, next) {

  const tag = req.query.tag;
  const nombre = req.query.nombre;
  const venta = req.query.venta;
  const precio = req.query.precio;
  let limit = req.query.limit;
  let skip = req.query.start;
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
      if (range[0] !== undefined && range[0] !== '') {
        criterios.precio = {};
        criterios.precio.$gte = parseInt(range[0]);
      }

      if (range[1] !== undefined && range[1] !== '') {
        criterios.precio = criterios.precio || {};
        criterios.precio.$lte = parseInt(range[1]);
      }
    } else {
      criterios.precio = parseInt(range[0]);
    }
  }

  if (limit && limit !== '') {

    limit = parseInt(limit);
  }

  if (limit && limit !== '') {

    skip = parseInt(skip);
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
