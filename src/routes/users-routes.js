'use strict';

// carregamento dos modulos
const express = require('express');
const router = express.Router();

// import dos controlers
const controler = require('../controles/users-controles');
const authService = require('../service/auth-service');
const userControlers = require('../controles/users-controles');

//criar customer
router.post('/', controler.post);

//metodo de put 
router.put('/:id', authService.authorize ,controler.put);

//metodo de delete
router.delete('/', authService.isAdmin ,controler.remove);

// autentificação
router.post('/authenticate', userControlers.authenticate);

//novo token
router.post('/refresh-token', authService.authorize, userControlers.refreshToken);

module.exports = router;