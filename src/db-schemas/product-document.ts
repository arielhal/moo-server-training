import {Document} from 'mongoose';

export type ProductType = {
    id?: any,
    name: string,
    description: string,
    price: number,
    quantity: number,
    imageUrl: string
};

export interface ProductDocument extends Document, ProductType {
    toClient: () => ProductType
}