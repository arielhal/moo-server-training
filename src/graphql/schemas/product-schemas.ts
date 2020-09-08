import {gql} from 'apollo-server-koa';

export const productSchemas = gql`
  type Query {
    getAllProducts: [Product]
    getSpecificProduct(id: ID!): Product
    getUserCart: [ProductInCart]
  }
  type Mutation {
    createProduct(product: ProductInput!): Product
    updateProduct(id: ID!, product: ProductUpdateInput!): Product
    deleteProduct(id: ID!): Product
    addToCart(id: ID!, quantity: Int): ProductAvailable
    removeFromCart(id:ID!, quantity:Int): ProductAvailable
    checkout: [ProductBought]
  }
  type Subscription {
    productUpdated(id: ID!): ProductAvailable
  }
  type Product {
    id: ID
    name: String
    description: String
    price: Float
    quantity: Int
    imageUrl: String
  }
  type ProductAvailable {
    id: ID
    newQuantity: Int
  }
  type ProductBought {
    id: ID
    quantity: Int
  }
  type ProductInCart {
    id: ID
    quantity: Int
  }
  input ProductInput {
    name: String!
    description: String!
    price: Float!
    quantity: Int!
    imageUrl: String!
  }
 input ProductUpdateInput {
    name: String
    description: String
    price: Float
    quantity: Int
    imageUrl: String
 }
`;