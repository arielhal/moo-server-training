import Router = require('koa-router');
import koaBody = require('koa-body');

const router = new Router();

import {
    sendAllProductsRequest,
    sendSpecificProductRequest,
    createProductRequest,
    updateProductRequest
} from './requests-handler';

router.get('/products', sendAllProductsRequest);
router.get('/products/:id', sendSpecificProductRequest);
router.post('/products', createProductRequest);
router.put('/products/:id', koaBody(), updateProductRequest);


export {router};