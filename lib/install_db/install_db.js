/**
 * Script para resetear el contenido de la base de datos o crearla si no existe.
 */

'use strict';

const fs = require('fs');
const path = require('path');

require('../connectMongoose');
require('../../models/Anuncio');
require('../../models/Usuario');
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Usuario = mongoose.model('Usuario');

/**
 * Eliminar las colecciones de la base de datos
 * @return {Promise}
 */
function dropDB() {

  return new Promise((resolve, reject) => {

    mongoose.connection.dropDatabase((err) => {
      if (err) {
        reject(err);
      }

      resolve('Modelos eliminados');
    });
  });
}

/**
 * Añadir los anuncios descritos en "data/anuncios.json" a la base de datos
 * @return {Promise}
 */
function installAnuncios() {

  return new Promise((res, rej) => {
    const anuncios = path.join(__dirname, 'data/anuncios.json');

    fs.readFile(anuncios, 'utf-8', (err, datos) => {
      if (err) {
        rej(err);
        return;
      }

      const dataJSON = JSON.parse(datos);

      dataJSON.anuncios.forEach((element) => {

        const anuncio = new Anuncio(element);

        anuncio.save((err, anuncioCreado) => {
          if (err) {
            rej(err);
            return;
          }

          console.log('Anuncio insertado con id', anuncioCreado._id);
        });
      });

      res('Anuncios insertados');
    });
  });
}

/**
 * Añadir los usuarios descritos en "data/usuarios.json" a la base de datos
 * @return {Promise}
 */
function installUsuarios() {

  return new Promise((res, rej) => {

    const usuarios = path.join(__dirname, 'data/usuarios.json');

    fs.readFile(usuarios, 'utf-8', (err, datos) => {
      if (err) {
        rej(err);
        return;
      }

      const dataJSON = JSON.parse(datos);

      dataJSON.usuarios.forEach((element) => {

        const usuario = new Usuario(element);

        usuario.save((err, usuarioCreado) => {
          if (err) {
            rej(err);
            return;
          }

          console.log('Usuario insertado con id', usuarioCreado._id);
        });
      });
      res('Usuarios insertados');
    });

  });
}

/**
 * Añadir los usuarios y anuncios a la base de datos
 * @return {Promise}
 */
function installBD() {

  return new Promise((resolve, reject) => {

    installAnuncios()
      .then((res) => {
        console.log(res);
        return installUsuarios();
      }).then((res) => {
        console.log(res);
        resolve('Todos los documentos insertados');
      }).catch(function (err) {
        reject(err);
      });
  });
}

dropDB().then(result => {
  console.log(result);
  return installBD();
}).then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.connection.close();
});
