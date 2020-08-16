import {Product} from '../../db-schemas/product-schema';
import {ProductDocument} from '../../db-schemas/product-document';
import mongoose = require('mongoose');
import {ClientSession} from 'mongoose';
import {CheckoutError} from '../../classes/checkout-error';

export const retrieveAllProducts = async () => {
    const products = await Product.find();
    return products.map((product) => product.toClient());
};

export const retrieveSpecificProduct = async (id: string) => {
    const product = await Product.findById(id);
    return product ? product.toClient() : null;
};

export const createProduct = async (productJson: ProductDocument) => {
    const productToCreate = new Product(productJson);
    const newProduct = await productToCreate.save();
    return newProduct.toClient();
};

export const updateProduct = async (id: string, newProductJson: Partial<ProductDocument>) => {
    const modifiedProduct = await Product.findByIdAndUpdate(id, newProductJson, {new: true});
    return modifiedProduct ? modifiedProduct.toClient() : null;
};

export const deleteProduct = async (id: string) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct ? deletedProduct.toClient() : null;
};


export const processOneProduct = async (id: string, quantity: number, session: ClientSession) => {
    const product = await Product.findOneAndUpdate({
        _id: id,
        quantity: {$gte: quantity}
    }, {$inc: {'quantity': -quantity}}, {new: true}).session(session);
    if (!product) {
        return {error: {id, message: 'Product not found or quantity not enough'}};
    } else
        return product;
};


export const checkout = async (buyList: [{ id: string, quantity: number }]) => {
    let productsList: (ProductDocument | { error: { id: string, message: string } })[];
    const errorList: { id: string, message: string }[] = [];
    let success = true;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        productsList = await Promise.all(buyList.map(productToBuy => processOneProduct(productToBuy.id, productToBuy.quantity, session)));
        productsList.forEach(element => {
            if ('error' in element) {
                errorList.push(element.error);
                success = false;
            }
        });
        if (!success)
            throw new CheckoutError(errorList);
    });
    session.endSession();
    return {'success': true};
};
