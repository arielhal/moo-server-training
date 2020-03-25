import {ExtendableContext} from 'koa';
import {retrieveAllProducts, retrieveSpecificProduct} from './dbActions';
import {IRouterParamContext} from 'koa-router';

const sendAllProducts = async (ctx: ExtendableContext & IRouterParamContext, next: () => Promise<any>) => {
    try {
        const res = await retrieveAllProducts();
        ctx.body = res;
    } catch (e) {
        console.log(e); // todo
    }
};

const sendSpecificProduct = async (ctx: ExtendableContext & IRouterParamContext, next: () => Promise<any>) => {
    try {
        const res = await retrieveSpecificProduct(ctx.params.id);
        ctx.body = res;
    } catch (e) {
        console.log(e); // todo
        ctx.status = 404;
        ctx.body = 'Not Found!'
    }
};

export {sendAllProducts, sendSpecificProduct};