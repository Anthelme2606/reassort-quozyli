import {useQuery,useMutation,useSubscription} from '@apollo/client';
import { ADD_PRODUCT_TO_REASSORT,UPDATE_QUANTITY,TOGGLE_STATE ,DESTROY_PRODUCT_IN_REASSORT} from '../lib/mutations';
import { GET_USER_REASSORT } from '../lib/queries';
import { GET_USER_REASSORT_UPDATED } from '../lib/subscriptions';
export const useAddToReassort=()=>{
    return useMutation(ADD_PRODUCT_TO_REASSORT);
}
export const useUpdateQuantity=()=>{
    return useMutation(UPDATE_QUANTITY);
}
export const useToggleState=()=>{
    return useMutation(TOGGLE_STATE);
}
export const useGetToReassort = (userId) => {
    return useQuery(GET_USER_REASSORT, {
        variables: { userId },
        fetchPolicy: 'network-only', 
    });
};

export const useGetToReassortUpdated=(reassort_id)=>{
    return useSubscription(GET_USER_REASSORT_UPDATED, {
        variables: { reassort_id }, 
      });
}
export const useDestroyProduct=()=>{
    return useMutation(DESTROY_PRODUCT_IN_REASSORT);
}