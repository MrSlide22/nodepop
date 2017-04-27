'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const CustomError = require('./lib/CustomError');
const expressValidator = require('express-validator');

var index = require('./routes/index');

require('./lib/connectMongoose');
require('./models/Usuario');
require('./models/Anuncio');

var app = express();

const i18n = require('i18n');
i18n.configure({
  locales: ['es', 'en'],
  register: global,
  directory: __dirname + '/locales',
});

app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressValidator());

app.use('/apiv1/:lang?/*', (req, res, next) => {

  if (req.params.lang) {
    i18n.setLocale(req, req.params.lang);
  } else {
    i18n.setLocale(req, 'es');
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', index);
app.use('/apiv1/:lang(es|en)?/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/:lang(es|en)?/usuarios', require('./routes/apiv1/usuarios'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new CustomError(req).page.notFound;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  console.log();

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500);
  res.json({ success: false, errors: err.message });
});

module.exports = app;
