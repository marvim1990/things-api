'use strict';

const repository = require('../repositorios/users-repositorio')

let errors = [];

function ValidationContract() {
    errors = [];
}

//valida se o campo não e nulo ou menor que zero
ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ message: message });
}

//valida se o campo e maior que X
ValidationContract.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
        errors.push({ message: message });
}

//valida se o campo e maior que X
ValidationContract.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
        errors.push({ message: message });
}

//não sei o que esse faz
ValidationContract.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len)
        errors.push({ message: message });
}

//valida o e-mail
ValidationContract.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ message: message });
}

// verifica se o email ja existe
ValidationContract.prototype.exists = async (email, message) => {
    const valid = await repository.getByEmail(email)
        if (valid) {
            errors.push({ message: message });
        }
}

ValidationContract.prototype.errors = () => { 
    return errors; 
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationContract;