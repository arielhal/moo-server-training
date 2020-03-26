import Joi = require('@hapi/joi');

const creationSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .required(),

    description: Joi.string()
        .alphanum()
        .required(),

    price: Joi.number()
        .integer()
        .min(0)
        .required(),

    quantity:
        Joi.number()
            .integer()
            .min(0)
            .required(),

    imageUrl: Joi.string()
        .required()
});

const updateSchema = Joi.object({
    name: Joi.string()
        .alphanum(),

    description: Joi.string()
        .alphanum(),

    price: Joi.number()
        .integer()
        .min(0),

    quantity:
        Joi.number()
            .integer()
            .min(0),

    imageUrl: Joi.string()
});

export {creationSchema, updateSchema};