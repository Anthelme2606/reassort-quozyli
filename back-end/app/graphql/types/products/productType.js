const { gql } = require("graphql-tag");

const productTypes = gql`
  scalar Upload
  scalar Date
 

  # Define the Reassort type
  type Reassort {
    id: Int
    user_id: Int
    state:String
    schedule_date: Date
    createdAt: Date
    updatedAt: Date
    products: [ReassortProduct] 
  }

  # Define the ReassortProduct type
  type ReassortProduct {
    id: Int
    product_id:String
    image_url:String
    price:Float
    titre:String
    description:String
    stock_quantity:Int
    status:String
    date_added:Date
    paid:Boolean
    createdAt: Date
    updatedAt: Date
    reassort:Reassort
    echeance:String
  }

 

  input ReassortInput {
    user_id: Int!
    state: ReassortState
    schedule_date: String
  }
  enum ReassortState {
    manual
    automatic
}


  input ReassortProductInput {
    user_id: Int
    state: ReassortState
    product_id: Int!
    titre:String
    description:String
    image_url:String
    price:Float
    reassort_id: Int
    stock_quantity: Int
   
  }
  input RemoveInput {
    user_id:Int
    reassort_id:Int
    product_id:Int
  }

  # Define Query type
  type Query {
    getReassort(user_id: Int!): Reassort 
  }

  # Define Mutation type
  type Mutation {
   
    # createReassort(data: ReassortInput!): Reassort # Create a new reassort
    updateQuantity(productId:Int,quantity:Int):ReassortProduct
    toggleState(reassortId:Int):Reassort
    addToReassort(data: ReassortProductInput): ReassortProduct # Add a product to a reassort
    removeProductFromReassort(data:RemoveInput): ReassortProduct # Remove a product from a reassort
    PlanReassort(reassort_id:Int,state:ReassortState):ReassortProduct
    # decreaseProductQuantity(product_Int: Int!, quantity: Int!): Product # Decrease the stock quantity of a product
    # increaseProductQuantity(product_Int: Int!, quantity: Int!): Product # Increase the stock quantity of a product
 
  }
  type Subscription {
    productUpdated(reassort_id:Int):ReassortProduct
  }
`;

module.exports = productTypes;
