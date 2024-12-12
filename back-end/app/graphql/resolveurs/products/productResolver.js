const Reassort_ProductService = require("../../../../src/services/reassort_products/reassort_productService.js");
const { pubsub, withFilter } = require("../../../../public/utils/pubsub");
const { PRODUCT_UPDATED } = require("../../../../public/utils/constantes");

module.exports = {
    Query: {
        getReassort: async (_, { user_id }) => {
            try {
                return await Reassort_ProductService.getReassort(user_id);
            } catch (error) {
                console.error("Error fetching reassort:", error);
                throw new Error("Failed to fetch reassort data");
            }
        },
    },
    Mutation: {
        addToReassort: async (_, { data }) => {
            try {
                const result = await Reassort_ProductService.addToReassort(data);

                // Publier l'événement de mise à jour uniquement si le produit a été ajouté
                if (result) {
                    pubsub.publish(PRODUCT_UPDATED, { productUpdated: result });
                }

                return result;
            } catch (error) {
               
                throw new Error("Failed to add product to reassort");
            }
        },
        removeProductFromReassort: async (_, { data }) => {
            try {
                const result = await Reassort_ProductService.removeProductFromReassort(data);

                // Publier l'événement de mise à jour uniquement si le produit a été supprimé
                if (result) {
                    pubsub.publish(PRODUCT_UPDATED, { productUpdated: result });
                }

                return result;
            } catch (error) {
               
                throw new Error("Failed to remove product from reassort");
            }
        },
        PlanReassort: async (_, { reassort_id, state }) => {
            try {
                const result = await Reassort_ProductService.PlanReassort(reassort_id, state);

                // Publier l'événement de mise à jour uniquement si le réassort a été planifié
                if (result) {
                    pubsub.publish(PRODUCT_UPDATED, { productUpdated: result });
                }

                return result;
            } catch (error) {
              
                throw new Error("Failed to plan reassort");
            }
        },
        toggleState: async (_, { reassortId }) => {
            try {
                const result = await Reassort_ProductService.toggleState(reassortId);

                // Publier l'événement de mise à jour uniquement si le réassort a été planifié
                if (result) {
                    pubsub.publish(PRODUCT_UPDATED, { productUpdated: result });
                }

                return result;
            } catch (error) {
              
                throw new Error("Failed to toggle reassort");
            }
        },
        updateQuantity: async (_, { productId, quantity }) => {
            try {
                const result = await Reassort_ProductService.updateQuantity(productId, quantity);

                // Publier l'événement de mise à jour uniquement si le réassort a été planifié
                if (result) {
                    pubsub.publish(PRODUCT_UPDATED, { productUpdated: result });
                }

                return result;
            } catch (error) {
              
                throw new Error("Failed to update quantity of the reassort product");
            }
        },
    },
    Reassort: {
        products: async (parent) => {
            try {
                return await Reassort_ProductService.getProducts(parent.id);
            } catch (error) {
                console.error("Error fetching products for reassort:", error);
                throw new Error("Failed to fetch products for reassort");
            }
        },
    },
    ReassortProduct: {
        echeance:async(parent)=>{
            try{
                return await Reassort_ProductService.getEcheance(parent.date_added);
            }catch(error){
                throw error;
            }
          
        },
        reassort: async (parent) => {
            try {
                return await Reassort_ProductService.getReassortById(parent.reassort_id);
            } catch (error) {
                console.error("Error fetching reassort by ID:", error);
                throw new Error("Failed to fetch reassort by ID");
            }
        },
    },
    Subscription: {
        productUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([PRODUCT_UPDATED]), // Événements publiés
                (payload, variables) => {
                    // Vérifiez si reassort_id est présent et faites le filtrage
                    if (variables.reassort_id && payload.productUpdated.reassort_id === variables.reassort_id) {
                        return !!payload.productUpdated; // Retourner le produit mis à jour
                    }
                    return null;
                }
            ),
        },
    },
};
