import {Product} from '../schemas/product-schema';
import {Context} from 'koa';
import {ProductDocument} from '../types/product-document';
import {logger} from '../middlewares/logger';

export const retrieveAllProducts = async (ctx: Context) => {
    try {
        const products = await Product.find();
        return products.map((product) => product.toClient());
    } catch (err) {
        ctx.throw(500, err);
    }
};

export const retrieveSpecificProduct = async (id: string, ctx: Context) => {
    try {
        const product = await Product.findById(id);
        if (!product)
            ctx.throw(404, 'Product Not Found!');
        return product.toClient();
    } catch (err) {
        ctx.throw(500, err);
    }
};

export const createProduct = async (productJson: object, ctx: Context) => {
    const productToCreate = new Product(productJson);
    try {
        const newProduct = await productToCreate.save();
        return newProduct.toClient();
    } catch (err) {
        ctx.throw(500, err);
    }
};

export const updateProduct = async (id: string, newProductJson: object, ctx: Context) => {
    try {
        const modifiedProduct = await Product.findByIdAndUpdate(id, newProductJson, {new: true});
        if (!modifiedProduct)
            ctx.throw(404, 'Product Not Found!');
        return modifiedProduct.toClient();
    } catch (err) {
        ctx.throw(500, err);
    }
};

export const deleteProduct = async (id: string, ctx: Context) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
            ctx.throw(404, 'Product Not Found!');
        return deletedProduct.toClient();
    } catch (err) {
        ctx.throw(500, err);
    }
};

const processOneProduct = (productToBuy: { id: string, quantity: number }, existingProduct: ProductDocument, resList: { id: string, success: boolean, error?: string }[], ctx: Context) => {
    if (productToBuy.quantity > existingProduct.quantity) {
        resList.push({
            id: productToBuy.id,
            success: false,
            error: `Not enough! quantity available: ${existingProduct.quantity}, Quantity required: ${productToBuy.quantity}`
        });
        return false;
    } else {
        try {
            existingProduct.save();
            logger.info(`Product id: ${existingProduct._id} quantity changed to: ${existingProduct.quantity - productToBuy.quantity}`);
        } catch (err) {
            ctx.throw(500, err);
        }
        resList.push({id: productToBuy.id, success: true});
        existingProduct.quantity -= productToBuy.quantity;
        return true;
    }
};

const processCheckout = (buyList: [{ id: string, quantity: number }], existingProducts: ProductDocument[], resList: { id: string, success: boolean, error?: string }[], ctx: Context) => {
    let allSuccess = true;
    buyList.forEach((productToBuy) => {
        let found = false;
        existingProducts.forEach((existingProduct) => {
            if (productToBuy.id === existingProduct._id.toString()) {
                found = true;
                if (!processOneProduct(productToBuy, existingProduct, resList, ctx))
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


export const checkout = async (buyList: [{ id: string, quantity: number }], ctx: Context) => {
    const resList: { id: string; success: boolean; error?: string; }[] = [];
    let existingProducts: ProductDocument[];
    const buyListIDs = buyList.map((element) => element.id);
    try {
        existingProducts = await Product.find({
            _id: {$in: buyListIDs}
        });
    } catch (err) {
        ctx.throw(500, err);
    }
    if (!processCheckout(buyList, existingProducts, resList, ctx)) {
        ctx.throw(400, JSON.stringify({'errors': resList}));
    }
    return resList;
};
