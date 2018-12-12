'use strict';

// carregamento dos modulos
const express = require('express');
const router = express.Router();

// import dos controlers
const controler = require('../controles/itens-controles');
const authService = require('../service/auth-service');

//busca aberta
router.get('/', controler.get);

router.get('/:id', controler.getByID);

//busca por nome e proximidade
router.get('/name/:name', controler.getByName);

//criar customer
router.post('/',authService.authorize, controler.post);

//metodo de put 
router.put('/:id', controler.put);

//metodo de delete
router.delete('/',authService.authorize, controler.remove);

module.exports = router;