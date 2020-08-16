import Router = require('koa-router');
import {
    getAllProductsRequest,
    getSpecificProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest,
    checkoutRequest
} from '../controllers/product-controller';

export const productsRouter = new Router();


productsRouter.get('/products', getAllProductsRequest);
productsRouter.get('/products/:id', getSpecificProductRequest);
productsRouter.post('/products', createProductRequest);
productsRouter.put('/products/:id', updateProductRequest);
productsRouter.delete('/products/:id', deleteProductRequest);
productsRouter.post('/checkout', checkoutRequest);
