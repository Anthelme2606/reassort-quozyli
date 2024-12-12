import {gql} from 'graphql-tag';
export const GET_USER_REASSORT=gql`
query GetReassort($userId: Int!) {
  getReassort(user_id: $userId) {
    id
    state
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

`;