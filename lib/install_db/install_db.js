'use strict';

const fs = require('fs');
const path = require('path');

require('../connectMongoose');
require('../../models/Anuncio');
require('../../models/Usuario');
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const Usuario = mongoose.model('Usuario');

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
        console.log(element);

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
