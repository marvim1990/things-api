'use strict';

// carregamento dos pacotes
const express = require('express');
const router = express.Router();

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: 'Things_API',
        version: '0.0.1'
    });
});

module.exports = route;