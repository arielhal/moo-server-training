import {
    checkout,
    createProduct, deleteProduct,
    retrieveAllProducts,
    retrieveSpecificProduct,
    updateProduct
} from '../../actions/DAL/product-db-actions';
import {logger} from '../../utils/logger';
import {UserInputError} from 'apollo-server-koa'
import {cartActionSchema, creationSchema, updateSchema} from '../../validation-schemas/product-request-schemas';
import {Context} from 'koa';
import {isUserExist} from '../../actions/users-manager';
import {addToCart, buildBuyListForUser, removeFromCart} from '../../actions/cart-manager';
import {pubsub} from '../../app';
import {CheckoutError} from '../../classes/checkout-error';
import {ProductType} from '../../db-schemas/product-document';

export const getAllProductsRequest = async (context: any) => {
    logger.info(context.ctx.cookies.get('Auth'));
    return await retrieveAllProducts()
};

export const getSpecificProductRequest = async (id: string) => {
    const product = await retrieveSpecificProduct(id);
    if (!product) {
        throw new UserInputError('Product not found!');
    }
    return product;
};

export const createProductRequest = async (productInput: { product: ProductType }, context: { ctx: Context }) => {
    let validatedBody;
    try {
        validatedBody = await creationSchema.validateAsync(productInput.product);
    } catch (err) {
        throw new UserInputError(err);
    }
    const newProduct = await createProduct(validatedBody);
    return newProduct;
    logger.info(`New product created on DB by: ${context.ctx.request.ip}. Product ID: ${newProduct.id}`);
};

export const updateProductRequest = async (productUpdateInput: { product: ProductType }, context: { ctx: Context }) => {
    let validatedBody;
    try {
        validatedBody = await updateSchema.validateAsync(productUpdateInput.product);
    } catch (err) {
        throw new UserInputError(err);
    }
    const modifiedProduct = await updateProduct(validatedBody.id, validatedBody);
    if (!modifiedProduct) {
        throw new UserInputError('Product not found!');
    }

    logger.info(`Product ID: ${modifiedProduct.id} updated by: ${context.ctx.request.ip}`);
    return modifiedProduct;
};

export const deleteProductRequest = async (id: string, context: { ctx: Context }) => {
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
        throw new UserInputError('Product not found!');
    }
    logger.info(`Product ID: ${deletedProduct.id} deleted by: ${context.ctx.request.ip}`)
    return deletedProduct;
};

class AuthenticationError implements Error {
    message: string;
    name: string;
}

export const addToCartRequest = async (productToAdd: { id: string, quantity: number }, context: { ctx: Context }) => {
    let validatedBody;
    if (!context.ctx.cookies.get('Auth') || !isUserExist(context.ctx.cookies.get('Auth'))) {
        throw new AuthenticationError();
    }
    try {
        validatedBody = await cartActionSchema.validateAsync(productToAdd);
    } catch (err) {
        throw new UserInputError(err);
    }
    try {
        const newQuantity = await addToCart(context.ctx.cookies.get('Auth'), validatedBody.id, validatedBody.quantity);
        const productAvailable = {id: validatedBody.id, newQuantity};
        await pubsub.publish(validatedBody.id, {productUpdated: productAvailable});
        return productAvailable;
    } catch (err) {
        throw new UserInputError(err);
    }
};

export const removeFromCartRequest = async (productToRemove: { id: string, quantity: number }, context: { ctx: Context }) => {
    let validatedBody;
    if (!context.ctx.cookies.get('Auth') || !isUserExist(context.ctx.cookies.get('Auth'))) {
        throw new AuthenticationError();
    }
    try {
        validatedBody = await cartActionSchema.validateAsync(productToRemove);
    } catch (err) {
        throw new UserInputError(err);
    }
    try {
        const newQuantity = await removeFromCart(context.ctx.cookies.get('Auth'), validatedBody.id, validatedBody.quantity);
        const productAvailable = {id: validatedBody.id, newQuantity};
        await pubsub.publish(validatedBody.id, {productUpdated: productAvailable});
        return productAvailable;
    } catch (err) {
        throw new UserInputError(err);
    }
};

export const checkoutRequest = async (context: { ctx: Context }) => {
    if (!context.ctx.cookies.get('Auth') || !isUserExist(context.ctx.cookies.get('Auth'))) {
        throw new AuthenticationError();
    }
    const buyList = buildBuyListForUser(context.ctx.cookies.get('Auth'));
    try {
        await checkout(buyList);
        await Promise.all(buyList.map(async (item: { id: string, quantity: number }) => {
            await removeFromCart(context.ctx.cookies.get('Auth'), item.id, item.quantity);
        }));
        return buyList;
    } catch (err) {
        if (err instanceof CheckoutError) {
            throw new UserInputError(err.message);
        } else
            throw err;
    }
};

export const getUserCartRequest = async (context: { ctx: Context }) => {
    if (!context.ctx.cookies.get('Auth') || !isUserExist(context.ctx.cookies.get('Auth'))) {
        throw new AuthenticationError();
    }
    return buildBuyListForUser(context.ctx.cookies.get('Auth'));
};