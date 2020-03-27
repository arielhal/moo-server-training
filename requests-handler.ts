import {DefaultContext, ExtendableContext} from 'koa';
import {retrieveAllProducts, retrieveSpecificProduct, createProduct, updateProduct, deleteProduct} from './dbActions';
import {IRouterParamContext} from 'koa-router';
import {creationSchema, updateSchema} from './request-schemas';
import {logger} from './logger';

const sendAllProductsRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    logger.info(`Got GET - get all products request from ${ctx.request.ip}`);
    try {
        ctx.body = await retrieveAllProducts();
    } catch (err) {
        ctx.status = 500;
        ctx.body = 'Internal Server Error!'
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
        console.log(err); // todo
        ctx.status = 500;
        ctx.body = 'Internal Server Error!'
    }
};

const createProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got POST - create product request from ${ctx.request.ip}`);
    try {
        const value = await creationSchema.validateAsync(ctx.request.body);
        ctx.status = 201;
        ctx.body = await createProduct(value);

    } catch (err) {
        ctx.status = 400;
        ctx.body = err;
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
        } else
            ctx.body = res;
    } catch (err) {
        ctx.status = 400;
        ctx.body = err;
    }
};

const deleteProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    logger.info(`Got DELETE - delete product request from ${ctx.request.ip}`);
    try {
        const res = await deleteProduct(ctx.params.id);
        if (res == null) {
            ctx.body = 'Product Not Found!';
            ctx.status = 404;
        } else
            ctx.body = res;
    } catch (err) {

        ctx.status = 500;
        ctx.body = 'Internal Server Error!';
    }
};

export {
    sendAllProductsRequest,
    sendSpecificProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest
};