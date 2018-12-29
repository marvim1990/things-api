'use strict';

// importa os modulos
const mongoose = require('mongoose');
const Itens = mongoose.model('Itens');

//save
exports.create = async(data) => {
    var item = new Itens(data);
    await item.save();
}

//put
exports.update = async(id, data) => {
    await Itens.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            availability: data.availability,
            timeCust: data.timeCust,
            description: data.description
        }
    });
}

// delete
exports.delete = async(id) => {
    await Itens.findOneAndRemove(id);
}

// busca aberta por proximidade e ativos
exports.get = async() => {
    const res = await Itens.find({ availability: true}, 'name timeCust itensImages latitude longitude owner');
    return res;
}

// busca por nome e proximidade
exports.getByNome = async(name) => {
    const res = Itens
        .find({
            name: name,
            availability: true
        }, 'name timeCust itensImages latitude longitude');
    return res;
}

//busca por ID
exports.getById = async(id) => {
    const res = Itens.findById(id);
    return res;
}