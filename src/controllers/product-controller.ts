import {Context} from 'koa';
import {
    retrieveAllProducts,
    retrieveSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    checkout
} from '../actions/product-db-actions';
import {creationSchema, updateSchema, checkoutSchema} from '../validation-schemas/product-request-schemas';
import {logger} from '../logger/logger';

export const getAllProductsRequest = async (ctx: Context) => {
    ctx.body = await retrieveAllProducts();
};

export const getSpecificProductRequest = async (ctx: Context) => {
    const product = await retrieveSpecificProduct(ctx.params.id);
    if (!product)
        ctx.throw(404, 'Product not found!');
    ctx.body = product;
};

export const createProductRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await creationSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
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
    }
    const modifiedProduct = await updateProduct(ctx.params.id, validatedBody);
    if (!modifiedProduct)
        ctx.throw(404, 'Product not found!');
    ctx.body = modifiedProduct;
    logger.info(`Product ID: ${modifiedProduct.id} updated by: ${ctx.request.ip}`);
};


export const deleteProductRequest = async (ctx: Context) => {
    const deletedProduct = await deleteProduct(ctx.params.id);
    if (!deletedProduct)
        ctx.throw(404, 'Product not found!');
    ctx.body = deletedProduct;
    logger.info(`Product ID: ${deletedProduct.id} deleted by: ${ctx.request.ip}`)
};

export const checkoutRequest = async (ctx: Context) => {
    let validatedBody;
    try {
        validatedBody = await checkoutSchema.validateAsync(ctx.request.body);
    } catch (err) {
        ctx.throw(400, err);
    }
    const checkoutRes = await checkout(validatedBody.buyList);
    if (!checkoutRes.success)
        ctx.throw(400, JSON.stringify(checkoutRes));
    ctx.body = JSON.stringify(checkoutRes);
};
