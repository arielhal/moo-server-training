import {Product} from '../db-schemas/product-schema';
import {ProductDocument} from '../db-schemas/product-document';
import {logger} from '../logger/logger';

export const retrieveAllProducts = async () => {
    const products = await Product.find();
    return products.map((product) => product.toClient());
};

export const retrieveSpecificProduct = async (id: string) => {
    const product = await Product.findById(id);
    if (!product)
        return null;
    return product.toClient();
};

export const createProduct = async (productJson: object) => {
    const productToCreate = new Product(productJson);
    const newProduct = await productToCreate.save();
    return newProduct.toClient();
};

export const updateProduct = async (id: string, newProductJson: object) => {
    const modifiedProduct = await Product.findByIdAndUpdate(id, newProductJson, {new: true});
    if (!modifiedProduct)
        return null;
    return modifiedProduct.toClient();
};

export const deleteProduct = async (id: string) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
        return null;
    return deletedProduct.toClient();
};

const processOneProduct = async (productToBuy: { id: string, quantity: number }, existingProduct: ProductDocument, resList: { id: string, success: boolean, error?: string }[]) => {
    if (productToBuy.quantity > existingProduct.quantity) {
        resList.push({
            id: productToBuy.id,
            success: false,
            error: `Not enough! quantity available: ${existingProduct.quantity}, Quantity required: ${productToBuy.quantity}`
        });
        return false;
    } else {
        logger.info(`Product id: ${existingProduct._id} quantity changed to: ${existingProduct.quantity - productToBuy.quantity}`);
        resList.push({id: productToBuy.id, success: true});
        existingProduct.quantity -= productToBuy.quantity;
        await existingProduct.save();
        return true;
    }
};

const processCheckout = async (buyList: [{ id: string, quantity: number }], existingProducts: ProductDocument[], resList: { id: string, success: boolean, error?: string }[]) => {
    let allSuccess = true;
    await buyList.forEach((productToBuy) => {
        let found = false;
        existingProducts.forEach(async (existingProduct) => {
            if (productToBuy.id === existingProduct._id.toString()) {
                found = true;
                const success = await processOneProduct(productToBuy, existingProduct, resList);
                if (!success)
                    allSuccess = false;
            }
        });
        if (!found) {
            resList.push({
                id: productToBuy.id,
                success: false,
                error: `Product id: ${productToBuy.id} not found!`
            });
            allSuccess = false;
        }
    });
    return allSuccess;
};


export const checkout = async (buyList: [{ id: string, quantity: number }]) => {
    const resList: { id: string; success: boolean; error?: string; }[] = [];
    let existingProducts: ProductDocument[];
    const buyListIDs = buyList.map((element) => element.id);
    existingProducts = await Product.find({
        _id: {$in: buyListIDs}
    });
    const success = await processCheckout(buyList, existingProducts, resList);
    if (!success) {
        return {'errors': resList};
    }
    return {'success': resList};
};
