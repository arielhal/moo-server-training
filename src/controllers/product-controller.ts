import {Context} from 'koa';
import {
    retrieveAllProducts,
    retrieveSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    checkout
} from '../actions/product-db-actions';
import {creationSchema, updateSchema, checkoutSchema} from '../schemas/product-request-schemas';
import {logger} from '../middlewares/logger';

export const getAllProductsRequest = async (ctx: Context) => {
    try {
        ctx.body = await retrieveAllProducts(ctx);
    } catch (err) {
        throw(err);
    }
};

export const getSpecificProductRequest = async (ctx: Context) => {
    try {
        ctx.body = await retrieveSpecificProduct(ctx.params.id, ctx);
    } catch (err) {
        throw(err);
    }
};

export const createProductRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await creationSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
    }
    try {
        const newProduct = await createProduct(validatedBody, ctx);
        ctx.body = newProduct;
        ctx.status = 201;
        logger.info(`New product created on DB by: ${ctx.request.ip}. Product ID: ${newProduct.id}`);
    } catch (err) {
        throw(err);
    }
};


export const updateProductRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await updateSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
    }
    try {
        const modifiedProduct = await updateProduct(ctx.params.id, validatedBody, ctx);
        ctx.body = modifiedProduct;
        ctx.status = 200;
        logger.info(`Product ID: ${modifiedProduct.id} updated by: ${ctx.request.ip}`);
    } catch (err) {
        throw(err);
    }
};


export const deleteProductRequest = async (ctx: Context) => {
    try {
        const deletedProduct = await deleteProduct(ctx.params.id, ctx);
        ctx.body = deletedProduct;
        ctx.status = 200;
        logger.info(`Product ID: ${deletedProduct.id} deleted by: ${ctx.request.ip}`)
    } catch (err) {
        throw(err);
    }
};

export const checkoutRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await checkoutSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
    }
    try {
        const checkoutRes = await checkout(validatedBody.buyList, ctx);
        ctx.body = {success: checkoutRes};
    } catch (err) {
        throw(err);
    }
};
