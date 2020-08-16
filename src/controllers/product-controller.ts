import {Context} from 'koa';
import {
    retrieveAllProducts,
    retrieveSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    checkout
} from '../actions/DAL/product-db-actions';
import {
    creationSchema,
    updateSchema,
    addToCartSchema, removeFromCartSchema
} from '../validation-schemas/product-request-schemas';
import {logger} from '../utils/logger';
import {CheckoutError} from '../classes/checkout-error';
import {createReadStream} from 'fs';
import {addToCart, buildBuyListForUser, removeFromCart} from '../actions/cart-manager';
import {io} from '../app';
import {getUserSocket, isUserExist} from '../actions/users-manager';

export const getAllProductsRequest = async (ctx: Context) => {
    ctx.body = await retrieveAllProducts();
    logger.info(ctx.cookies.get('io'));
};

export const getSpecificProductRequest = async (ctx: Context) => {
    const product = await retrieveSpecificProduct(ctx.params.id);
    if (!product) {
        ctx.throw(404, 'Product not found!');
        return;
    }
    ctx.body = product;
};

export const createProductRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await creationSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
    const newProduct = await createProduct(validatedBody);
    ctx.body = newProduct;
    ctx.status = 201;
    logger.info(`New product created on DB by: ${ctx.request.ip}. Product ID: ${newProduct.id}`);
};


export const updateProductRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await updateSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
    const modifiedProduct = await updateProduct(ctx.params.id, validatedBody);
    if (!modifiedProduct) {
        ctx.throw(404, 'Product not found!');
        return;
    }

    ctx.body = modifiedProduct;
    logger.info(`Product ID: ${modifiedProduct.id} updated by: ${ctx.request.ip}`);
};


export const deleteProductRequest = async (ctx: Context) => {
    const deletedProduct = await deleteProduct(ctx.params.id);
    if (!deletedProduct) {
        ctx.throw(404, 'Product not found!');
        return;
    }
    ctx.body = deletedProduct;
    logger.info(`Product ID: ${deletedProduct.id} deleted by: ${ctx.request.ip}`)
};

export const checkoutRequest = async (ctx: Context) => {
    if (!ctx.cookies.get('io') || !isUserExist(ctx.cookies.get('io'))) {
        ctx.throw(401, 'Not Authorized');
        return;
    }
    const buyList = buildBuyListForUser(ctx.cookies.get('io'));
    try {
        ctx.body = await checkout(buyList);
        await Promise.all(buyList.map(async (item: { id: string, quantity: number }) => {
            await removeFromCart(ctx.cookies.get('io'), item.id);
        }));
    } catch (err) {
        if (err instanceof CheckoutError) {
            ctx.throw(400, err);
            return;
        } else
            throw err;
    }
};

// Just for testing
export const testWS = async (ctx: Context) => {
    logger.info('hello');
    ctx.type = 'html';
    ctx.body = createReadStream('index.html');
};

export const addToCartRequest = async (ctx: Context) => {
    let validatedBody;
    if (!ctx.cookies.get('io') || !isUserExist(ctx.cookies.get('io'))) {
        ctx.throw(401, 'Not Authorized');
        return;
    }
    try {
        validatedBody = await addToCartSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
    try {
        const newQuantity = await addToCart(ctx.cookies.get('io'), validatedBody.id, validatedBody.quantity);
        const socket = getUserSocket(ctx.cookies.get('io'));
        socket.broadcast.emit('update', JSON.stringify({id: validatedBody.id, newQuantity}));
        ctx.body = {success: true};
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
};

export const removeFromCartRequest = async (ctx: Context) => {
    let validatedBody;
    if (!ctx.cookies.get('io') || !isUserExist(ctx.cookies.get('io'))) {
        ctx.throw(401, 'Not Authorized');
        return;
    }
    try {
        validatedBody = await removeFromCartSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
    try {
        const newQuantity = await removeFromCart(ctx.cookies.get('io'), validatedBody.id);
        const socket = getUserSocket(ctx.cookies.get('io'));
        socket.broadcast.emit('update', JSON.stringify({id: validatedBody.id, newQuantity}));
        ctx.body = {success: true};
    } catch (err) {
        ctx.throw(400, err);
        return;
    }
};
