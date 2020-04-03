import {Schema} from 'mongoose';
import mongoose = require('mongoose');
import {ProductDocument} from '../types/product-document'

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    imageUrl: {type: String, required: true}
});

productSchema.methods.toClient = function () {
    const productObj = this.toObject();
    productObj.id = productObj._id;
    delete productObj._id;
    delete productObj.__v;
    return productObj;
};


export const Product = mongoose.model<ProductDocument>('Product', productSchema);
