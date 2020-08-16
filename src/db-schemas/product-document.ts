import {Document} from 'mongoose';

type ProductType = {
    id?: any,
    description: string,
    price: number,
    quantity: number,
    imageUrl: string
};

export interface ProductDocument extends Document, ProductType {
    toClient: () => ProductType
}