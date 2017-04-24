'use strict';

const fs = require('fs');
const path = require('path');

require('../connectMongoose')
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

function installAnuncio(callback) {
    const anuncios = path.join(__dirname, 'data/anuncios.json');

    fs.readFile(anuncios, 'utf-8', (err, datos) => {
        if (err) {
            callback(err);
            return;
        }

        const dataJSON = JSON.parse(datos);

        dataJSON.anuncios.forEach((element) => {
            console.log(element);

            const anuncio = new Anuncio(element);

            anuncio.save((err, anuncioCreado) => {
                if (err) {
                    callbak(err);
                    return;
                }
                console.log('Anuncio insertado con id', anuncioCreado._id);
            });
        });
    });
}

function installUsuario(callback) {
    const usuarios = path.join(__dirname, 'data/usuarios.json');

    fs.readFile(usuarios, 'utf-8', (err, datos) => {
        if (err) {
            callback(err);
            return;
        }

        const dataJSON = JSON.parse(datos);

        dataJSON.usuarios.forEach((element) => {
            console.log(element);

            const usuario = new Usuario(element);

            usuario.save((err, usuarioCreado) => {
                if (err) {
                    callbak(err);
                    return;
                }
                console.log('Usuario insertado con id', anuncioCreado._id);
            });
        });
    });
}

function installBD() {

    return new Promise((resolve, reject) => {

        installAnuncio((err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
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