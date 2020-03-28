import {Product} from './db-schema';
import {logger} from './logger';

const retrieveAllProducts = () => {
    return new Promise((resolve, reject) => {
        Product.find(((err, res) => {
            if (err)
                return reject(err);
            resolve({products: res});
        }));
    });
};

const retrieveSpecificProduct = (id: string) => {
    return new Promise(((resolve, reject) => {
        Product.findById(id, ((err, res) => {
            if (err)
                return reject(err);
            resolve(res);
        }));
    }));
};

const createProduct = (productJson: object) => {
    const productToCreate = new Product(productJson);
    return new Promise(((resolve, reject) => {
        productToCreate.save(((err, product) => {
            if (err) {
                return reject(err);
            }
            resolve(product);
        }));
    }));
};

const updateProduct = (id: string, newProductJson: object) => {
    return new Promise(((resolve, reject) => {
        Product.findOneAndUpdate({_id: id}, newProductJson, {new: true}, ((err, doc) => {
            if (err)
                return reject(err);
            resolve(doc);
        }));
    }));
};

const deleteProduct = (id: string) => {
    return new Promise(((resolve, reject) => {
        Product.findOneAndDelete({_id: id}, ((err, doc) => {
            if (err)
                return reject(err);
            resolve(doc);
        }));
    }));
};

const checkout = async (buyList: [{ id: string, quantity: number }]) => {
    const resList: { id: string; success: boolean; error?: string; }[] = [];
    let hadError = false;
    try {
        for (const productToBuy of buyList) {
            const existingProduct = await retrieveSpecificProduct(productToBuy.id);
            if (existingProduct == null) {
                resList.push({id: productToBuy.id, success: false, error: 'Product not found'});
                hadError = true;
                // @ts-ignore
            } else if (existingProduct.quantity < productToBuy.quantity) {
                resList.push({
                    id: productToBuy.id,
                    success: false,
                    // @ts-ignore
                    error: `Not enough! quantity available: ${existingProduct.quantity}, Quantity required: ${productToBuy.quantity}`
                });
                hadError = true;
            } else {
                resList.push({
                    id: productToBuy.id,
                    success: true,
                });
                // @ts-ignore
                existingProduct.quantity -= productToBuy.quantity;
                // @ts-ignore
                await existingProduct.save();
                // @ts-ignore
                logger.info(`Product id: ${existingProduct._id} quantity changed to: ${existingProduct.quantity}`)
            }
        }
        return new Promise(((resolve, reject) => {
            if (hadError)
                return reject(resList);
            resolve(resList);
        }));
    } catch (err) {
        return new Promise((resolve, reject) => {
            return reject(err);
        });
    }
};


export {retrieveAllProducts, retrieveSpecificProduct, createProduct, updateProduct, deleteProduct, checkout};
