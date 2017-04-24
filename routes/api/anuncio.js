'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');

/* GET home page. */
router.post('/', function (req, res, next) {
  // console.log('probando insertar anuncio');

  // const datosAnuncio = req.body;
  // console.log(datosAnuncio);
  // const anuncio = new Anuncio(datosAnuncio);

  // anuncio.save((err, anuncioCreado) => {
  //   if (err) {
  //     console.log('Error', err);
  //     next(err);
  //     return;
  //   }

  //   res.json({success: true, result: anuncioCreado});
  // });
});

module.exports = router;
