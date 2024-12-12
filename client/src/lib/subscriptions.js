import {gql} from 'graphql-tag';
export const GET_USER_REASSORT_UPDATED=gql`
subscription ProductUpdated($reassortId: Int) {
  productUpdated(reassort_id: $reassortId) {
    stock_quantity
    updatedAt
    status
    product_id
    price
    titre
    echeance
    paid
    image_url
    id
    reassort {
      user_id
      updatedAt
      state
      schedule_date
      id
      createdAt
      products {
      id
      product_id
      image_url
      price
      titre
      description
      stock_quantity
      status
      echeance
      date_added
      paid
      createdAt
      updatedAt
    }
    }
  }
}

`;