import Router = require('koa-router');

const router = new Router();

import {
    sendAllProductsRequest,
    sendSpecificProductRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest
} from './requests-handler';

router.get('/products', sendAllProductsRequest);
router.get('/products/:id', sendSpecificProductRequest);
router.post('/products', createProductRequest);
router.put('/products/:id', updateProductRequest);
router.delete('/products/:id', deleteProductRequest);


export {router};