import {gql} from 'graphql-tag';
export const ADD_PRODUCT_TO_REASSORT=gql`
mutation AddToReassort($data: ReassortProductInput) {
  addToReassort(data: $data) {
    updatedAt
    stock_quantity
    status
    product_id
    price
    image_url
    id
    description
    date_added
    createdAt
    reassort {
      id
      user_id
      state
      schedule_date
      createdAt
      updatedAt
    }
  }
}
`;
export const UPDATE_QUANTITY=gql`
mutation UpdateQuantity($productId: Int, $quantity: Int) {
  updateQuantity(productId: $productId, quantity: $quantity) {
    stock_quantity
  }
}
`;
export const TOGGLE_STATE=gql`
mutation ToggleState($reassortId: Int) {
  toggleState(reassortId: $reassortId) {
    state
  }
}
`;
export const DESTROY_PRODUCT_IN_REASSORT=gql`
mutation RemoveProductFromReassort($data: RemoveInput) {
  removeProductFromReassort(data: $data) {
    titre
  }
}
`;