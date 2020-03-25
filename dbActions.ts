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
            if (err || res == null)
                return reject(err);
            resolve(res);
        }));
    }));
};
export {retrieveAllProducts, retrieveSpecificProduct};