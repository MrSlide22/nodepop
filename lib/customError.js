/**
 * Módulo para centralizar los mensajes de error y el idioma
 * en el que se sirven
 */

'use strict';

/**
 * @constructor CustomError
 * @param {Request} req - Petición con el métido __() del módulo i18n
 */
function CustomError(req) {

  this.server = {
    internalError: {
      status: 500,
      message: req.__('server.internalError'),
    },
  };
  this.page = {
    notFound: {
      status: 404,
      message: req.__('page.notFound'),
    },
  };
  this.user = {
    badCredentials: {
      status: 401,
      message: req.__('user.badCredentials'),
    },
  };
  this.token = {
    notFound: {
      status: 400,
      message: req.__('token.notFound'),
    },
    invalid: {
      status: 401,
      message: req.__('token.invalid'),
    },
  };
  this.tag = {
    invalid: {
      status: 400,
      message: req.__('invalidTag'),
    },
  };
  /**
   * Nuevo error validando variables. No necesita request
   * @param {Object} errors - Objecto con los errores
   */
  this.validation = (errors) => {

    const messages = errors.map(function (elem) {
      return req.__('theField') + ' ' + elem.param + ' ' + elem.msg;
    });

    return {
      status: 400,
      message: messages,
    };
  };
}

module.exports = CustomError;
