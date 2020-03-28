import {DefaultContext, ExtendableContext} from 'koa';
import {
    retrieveAllProducts,
    retrieveSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    checkout
} from './dbActions';
import {IRouterParamContext} from 'koa-router';
import {creationSchema, updateSchema, checkoutSchema} from './request-schemas';
import {logger} from './logger';

const sendAllProductsRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    logger.info(`Got GET - get all products request from ${ctx.request.ip}`);
    try {
        ctx.body = await retrieveAllProducts();
    } catch (err) {
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
        logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
    }
};

const sendSpecificProductRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    logger.info(`Got GET - get specific product request from ${ctx.request.ip}`);
    try {
        const res = await retrieveSpecificProduct(ctx.params.id);
        if (res == null) {
            ctx.body = 'Product Not Found!';
            ctx.status = 404;
        } else {
            ctx.body = res;
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
        logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
    }
};

const createProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got POST - create product request from ${ctx.request.ip}`);
    try {
        const value = await creationSchema.validateAsync(ctx.request.body);
        ctx.status = 201;
        const res = await createProduct(value);
        ctx.body = res;
        // @ts-ignore
        logger.info(`New product created on DB by: ${ctx.request.ip}. Product ID: ${res._id}`)

    } catch (err) {
        if (err.name === 'MongoError') {
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
            logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
        } else {
            ctx.status = 400;
            ctx.body = err;
        }
    }
};

const updateProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got PUT - update product request from ${ctx.request.ip}`);
    try {
        const value = await updateSchema.validateAsync(ctx.request.body);
        const res = await updateProduct(ctx.params.id, value);
        if (res == null) {
            ctx.body = 'Product Not Found!';
            ctx.status = 404;
        } else {
            ctx.body = res;
            // @ts-ignore
            logger.info(`Product ID: ${res._id} updated by: ${ctx.request.ip}`)
        }
    } catch (err) {
        if (err.name === 'MongoError') {
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
            logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
        } else {
            ctx.status = 400;
            ctx.body = err;
        }
    }
};

const deleteProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got DELETE - delete product request from ${ctx.request.ip}`);
    try {
        const res = await deleteProduct(ctx.params.id);
        if (res == null) {
            ctx.body = 'Product Not Found!';
            ctx.status = 404;
        } else {
            ctx.body = res;
            // @ts-ignore
            logger.info(`Product ID: ${res._id} deleted by: ${ctx.request.ip}`)
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = 'Internal Server Error!';
        logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
    }
};

const checkoutRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got POST - checkout request from ${ctx.request.ip}`);
    try {
        const value = await checkoutSchema.validateAsync(ctx.request.body);
        const res = await checkout(value.buyList);
        ctx.body = {success: res};
    } catch (err) {
        if (err.name === 'MongoError') {
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
            logger.warn(`Request from: ${ctx.request.ip} failed because of DB error`);
        } else {
            ctx.status = 400;
            ctx.body = {errors: err};
        }
    }
};

export {
    sendAllProductsRequest,
    sendSpecificProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest,
    checkoutRequest
};