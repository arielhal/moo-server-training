import {Schema} from 'mongoose';
import mongoose = require('mongoose');


const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    imageUrl: String
});

const Product = mongoose.model('Product', productSchema);


export {Product};


