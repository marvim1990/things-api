'use strict';

// importa o repositorio
const repository = require('../repositorios/itens-repositorio');

// importa os modulos
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');
const ValidationContract = require('../service/validator-service');

//auth
const auth = require('../service/auth-service');

// RegEx
const regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;

// Post
exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.isRequired(req.body.name, 'O campo nome e necessario para prosseguir');
    contract.hasMaxLen(req.body.name, 30, 'O campo nome tem um numero maximo de 30 caracteres');
    contract.hasMinLen(req.body.description, 5, 'O campo de descrição tem um tamanho minimo de 5 caracteres');
    contract.hasMaxLen(req.body.description, 30, 'O campo de descrição tem um tamanho máximo de 30 caracteres');
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        const token = req.body.token || req.query.token || req.headers['access-token'];
        const data = await auth.decodeToken(token);
        
        //azure-storage
        const azureSrv = azure.createBlobService(config.connectionAzure);

        //imagen
        let pic = req.body.itensImages;
        let picName = guid.raw().toString() + '.jpg';
        let matches = pic.match(regex);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        
        //upload da foto
        await azureSrv.createBlockBlobFromText('itens-pictures', picName , buffer, { 
            contentType: type
        },function (error, result, response) {
            if (error) {
                picName = 'default-product.png';
                console.log(error);
            } else {
                console.log(result);
            }
        });

        await repository.create({
            name: req.body.name,
            availability: req.body.availability,
            timeCust: req.body.timeCust,
            itensImages: 'https://thingstorage.blob.core.windows.net/itens-pictures/' + picName,
            description: req.body.description,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            owner: data.id
        });
        res.status(201).send({
            status: 'OK',
            message: 'Item cadastrado'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Erro ao cadastrar'
        });
    }
}

// Update
exports.put = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['access-token'];
        const data = await auth.decodeToken(token);
        const i = await repository.getById(req.params.id);
        if (data.id == i.owner) {
            await repository.update(req.params.id, req.body);
            res.status(201).send({
                status: 'OK',
                message: 'Item atualizado'
            })
        } else {
            res.status(403).send({
                status: 'OK',
                message: 'Você não pode atualizar esses dados'
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Erro na atualização'
        });
    }
}

// Delete
exports.remove = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['access-token'];
        const data = await auth.decodeToken(token);
        const i = await repository.getById(req.params.id);
        if (data.id == i.owner) {
            await repository.delete(req.params.id);
            res.status(201).send({
                status: 'OK',
                message: 'Item excluido'
            })
        } else {
            res.status(403).send({
                status: 'OK',
                message: 'Você não pode excluir esse Item'
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Erro na exclusão'
        })
    }
}

// Busca aberta por proximidade e ativos
exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send({
            status: 'OK', 
            itens : {
                data
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Falha ao processar sua requisição'
        });
    }
} 

// busca por nome e proximidade
exports.getByName = async(req, res, next) => {
    try {
        var data = await repository.getByNome(req.params.name);
        res.status(200).send({status: 'OK', data});
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Item não encontrado'
        });
    }
}

exports.getByID = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send({status: 'OK', data});
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 'Erro',
            message: 'Falha ao processar sua requisição'
        });
    }
}
