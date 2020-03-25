import Router = require('koa-router');

const router = new Router();

import {sendAllProducts, sendSpecificProduct} from './requests-handler';

router.get('/products', sendAllProducts);
router.get('/products/:id', sendSpecificProduct);


export {router};