import {
    addToCartRequest, checkoutRequest,
    createProductRequest, deleteProductRequest,
    getAllProductsRequest,
    getSpecificProductRequest, getUserCartRequest, removeFromCartRequest, updateProductRequest
} from '../controllers/graphql-product-controller';
import {ProductType} from '../../db-schemas/product-document';
import {pubsub} from '../../app';
import {Context} from 'koa';


export const resolvers = {
    Query: {
        getAllProducts: (_parent: any, _args: any, context: { ctx: Context }) => getAllProductsRequest(context),
        getSpecificProduct: (_parent: any, args: { id: string }) => getSpecificProductRequest(args.id),
        getUserCart: (_parent: any, _args: any, context: { ctx: Context }) => getUserCartRequest(context)
    },
    Mutation: {
        createProduct: (_parent: any, args: { product: ProductType }, context: { ctx: Context }) => createProductRequest(args, context),
        updateProduct: (_parent: any, args: { product: ProductType }, context: { ctx: Context }) => updateProductRequest(args, context),
        deleteProduct: (_parent: any, args: { id: string }, context: { ctx: Context }) => deleteProductRequest(args.id, context),
        addToCart: (_parent: any, args: { id: string, quantity: number }, context: { ctx: Context }) => addToCartRequest(args, context),
        removeFromCart: (_parent: any, args: { id: string, quantity: number }, context: { ctx: Context }) => removeFromCartRequest(args, context),
        checkout: (_parent: any, _args: any, context: { ctx: Context }) => checkoutRequest(context)
    },
    Subscription: {
        productUpdated: {
            subscribe: (_parent: any, args: { id: string }) => pubsub.asyncIterator([args.id])
        }
    },
    Product: {
        id: (parent: ProductType) => parent.id,
        name: (parent: ProductType) => parent.name,
        description: (parent: ProductType) => parent.description,
        price: (parent: ProductType) => parent.price,
        quantity: (parent: ProductType) => parent.quantity,
        imageUrl: (parent: ProductType) => parent.imageUrl
    }
};