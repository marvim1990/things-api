'use strict';

// carregamento dos modulos
const mongoose = require('mongoose');
const Profiles = mongoose.model('Profiles');

// save
exports.create = async(data) => {
    var profile = new Profiles(data);
    await profile.save();
}

// update
exports.update = async(id, data) => {
    await Profiles.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            profilePicture: data.profilePicture,
        }
    });
}

// delete
exports.delete = async(id) => {
    await Profiles.findOneAndRemove(id);
}

exports.getByID = async(id) => {
    const res = await Profiles.findById(id);
    return res;
}

exports.getByEmail = async(email) => {
    const res = await Profiles.findOne({
        email: email
    })
    return res
}

// validation
exports.authenticate = async(data) => {
    const res = await Profiles.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}