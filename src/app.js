'use strict';

// carregamento dos modulos
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// conecta com o DB
mongoose.connect(config.connectionString);

// Carrega os models
const Profiles = require('./models/profiles');
const Itens = require('./models/itens');

// carregamento das rotas
const index = require('./routes/index')
const routesUsers = require('./routes/users-routes');
const routesItens = require('./routes/itens-routes');

app.use(bodyParser.json({ limit: '7mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// implementa as rotas 
app.use('/', index);
app.use('/profiles', routesUsers);
app.use('/itens', routesItens);

module.exports = app;