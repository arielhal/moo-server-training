import {DefaultContext, ExtendableContext} from 'koa';
import {retrieveAllProducts, retrieveSpecificProduct, createProduct, updateProduct, deleteProduct} from './dbActions';
import {IRouterParamContext} from 'koa-router';
import {creationSchema, updateSchema} from './request-schemas';
import {notFound} from './errors';

const sendAllProductsRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    try {
        ctx.body = await retrieveAllProducts();
    } catch (err) {
        console.log(err); // todo
    }
};

const sendSpecificProductRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    try {
        ctx.body = await retrieveSpecificProduct(ctx.params.id);
    } catch (err) {
        console.log(err); // todo
        ctx.status = 404;
        ctx.body = 'Not Found!'
    }
};

const createProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    try {
        const value = await creationSchema.validateAsync(ctx.request.body);
        ctx.body = await createProduct(value);

    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }

};

const updateProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    try {
        const value = await updateSchema.validateAsync(ctx.request.body);
        ctx.body = await updateProduct(ctx.params.id, value);
    } catch (err) {
        if (err === notFound)
            ctx.status = 404;
        else
            ctx.status = 400;
        ctx.body = err;
    }
};

const deleteProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    try {
        ctx.body = await deleteProduct(ctx.params.id);
    } catch (err) {
        if (err === notFound)
            ctx.status = 404;
        else
            ctx.status = 400;
        ctx.body = err;
    }
};

export {
    sendAllProductsRequest,
    sendSpecificProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest
};