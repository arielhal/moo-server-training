import {Document} from 'mongoose';

export interface ProductDocument extends Document {
    _id: string,
    description: string,
    price: number,
    quantity: number,
    imageUrl: string,
    toClient: () => {
        id: string,
        description: string,
        price: number,
        quantity: number,
        imageUrl: string,
    }
}