import {DefaultContext, ExtendableContext} from 'koa';
import {retrieveAllProducts, retrieveSpecificProduct, createProduct, updateProduct} from './dbActions';
import {IRouterParamContext} from 'koa-router';
import {creationSchema, updateSchema} from './request-schemas';
import {notFound} from './errors';

const sendAllProductsRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    try {
        const res = await retrieveAllProducts();
        ctx.body = res;
    } catch (e) {
        console.log(e); // todo
    }
};

const sendSpecificProductRequest = async (ctx: ExtendableContext & IRouterParamContext) => {
    try {
        const res = await retrieveSpecificProduct(ctx.params.id);
        ctx.body = res;
    } catch (e) {
        console.log(e); // todo
        ctx.status = 404;
        ctx.body = 'Not Found!'
    }
};

const createProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    try {
        const value = await creationSchema.validateAsync(JSON.parse(ctx.request.body));
        const res = await createProduct(value);
        ctx.body = res;

    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }

};

const updateProductRequest = async (ctx: ExtendableContext & DefaultContext & IRouterParamContext) => {
    try {
        const value = await updateSchema.validateAsync(JSON.parse(ctx.request.body));
        const res = await updateProduct(ctx.params.id, value);
        ctx.body = res;
    } catch (err) {
        if (err === notFound)
            ctx.status = 404;
        else
            ctx.status = 400;
        ctx.body = err;
    }
};


export {sendAllProductsRequest, sendSpecificProductRequest, createProductRequest, updateProductRequest};