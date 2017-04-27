'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const CustomError = require('./CustomError');

module.exports = (req, res, next) => {

  // recogemos el token jwt
  const token = req.body.token || req.query.token || req.get('x-access-token');

  // si no llega el token responder no autorizado
  if (!token) {
    const err = new CustomError(req).token.notFound;
    next(err);
    return;
  }

  // validar el token
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      const err = new CustomError(req).token.invalid;
      next(err);
      return;
    }

    req.usuario_id = decoded.usuario_id;
    next();
  });
};
