var express = require('express');
var consign = require('consign');
var morgan = require('morgan');
var logger = require('./../services/logger.js');

module.exports = function(){
  var app = express();
  app.set('view engine', 'html');

  app.use(morgan('common', {
    stream: {
      write: function( mensagem ) {
        logger.info(mensagem);
      }
    }
  }));

  consign()
   .include('routes')
   .then('controllers')
   .then('services')
   .then('views')
   .into(app);

  return app;
};