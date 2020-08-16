import Joi = require('@hapi/joi');

export const creationSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .required(),

    description: Joi.string()
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

export const updateSchema = Joi.object({
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

export const checkoutSchema = Joi.object({
    buyList: Joi.array()
        .items(Joi.object({
            id: Joi.string()
                .alphanum()
                .required(),
            quantity: Joi.number()
                .integer()
                .min(0)
                .required()
        }))
        .required()
});

