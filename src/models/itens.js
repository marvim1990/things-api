'use strict';

// carregamento dos modulos
const moongose = require('mongoose');
const Schema = moongose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    timeCust: {
        type: String,
        required: true,
    },
    itensImages: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: [{
        type: String,
        require: false
    }],
    owner: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'Profiles'
    }
});

module.exports = moongose.model('Itens', schema);