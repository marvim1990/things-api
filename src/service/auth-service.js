'use strict';

const jwt = require('jsonwebtoken');

exports.generateToken = async(data) => {
    return jwt.sign(data, global.Uni_KEY, { expiresIn: '9d'});
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.Uni_KEY);
    return data;
}

exports.authorize = function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['access-token'];
    if (!token) {
        res.status(401).json({
            message: 'Acesso restrito'
        });
    } else {
        jwt.verify(token, global.Uni_KEY, function(error, decoded) {
            if (error) {
                res.status(401).json ({
                    meesage: 'Token invalido'
                });
            } else {
                next();
            }
        })
    }
}

exports.isAdmin = function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['access-token'];
    if (!token) {
        res.status(401).json ({
            meesage: 'Token invalido'
        });
    } else {
        jwt.verify(token, global.Uni_KEY, function(error, decode) {
            if (error) {
                res.status(401).json({
                    meesage: 'Token invalido'
                });
            } else {
                if (decode.roles.includes('admin')) {
                    next()
                } else {
                    res.status(403).json({
                        meesage: 'Esta é uma funcionalidade restrita'
                    });
                }
            }
        })
    }
}