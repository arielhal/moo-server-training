import {Product} from './schema';

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

export {retrieveAllProducts, retrieveSpecificProduct, createProduct, updateProduct, deleteProduct};
