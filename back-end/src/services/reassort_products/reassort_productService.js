const Reassort_ProductRepository = require("../../repositories/reassort_products/reassort_productRepository");
const cron = require("node-cron");
const moment = require("moment");
class Reassort_ProductService {
  static async addToReassort(data) {
    try {
      const product = await Reassort_ProductRepository.addToReassort(data);
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getReassortById(id) {
    try {
      return await Reassort_ProductRepository.getReassortById(id);
    } catch (error) {
      throw error;
    }
  }

  static async getProducts(rea_id) {
    try {
      return await Reassort_ProductRepository.getProducts(rea_id);
    } catch (error) {
      throw error;
    }
  }

  static async getReassort(user_id) {
    try {
      return await Reassort_ProductRepository.getReassort(user_id);
    } catch (error) {
      throw error;
    }
  }

  static async removeProductFromReassort(data) {
    try {
      return await Reassort_ProductRepository.removeProductFromReassort(data);
    } catch (error) {
      throw error;
    }
  }
  static async updateQuantity(productId,quantity){
    try{

    }catch(error){
      throw error;
    }
  }
  static async getEcheance(dateAdded){
      const startDate = new Date(dateAdded);
      const currentDate = new Date();
      const diffInMs = currentDate - startDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const totalDays = process.env.DAY_ECHEANCE;
      
      // Calculer le nombre de jours restants
      const daysRemaining = Math.max(totalDays - diffInDays, 0); 

      
      return daysRemaining;
    
      
  }
  static async updateQuantity(productId,quantity){
    try{
      return await Reassort_ProductRepository.updateQuantity(productId, quantity);
    }catch(error){
      throw error;
    }
  }
  static async toggleState(reassortId){
    try{
      return await Reassort_ProductRepository.toggleState(reassortId);
    }catch(error){
      throw error;
    }
  }

  static async PlanReassort(reassort_id, state) {
    try {
      return await Reassort_ProductRepository.PlanReassort(reassort_id, state);
    } catch (error) {
      throw error;
    }
  }

  // Méthode pour vérifier les actions basées sur les délais
  static async checkActions() {
    try {
      const now = moment();
      const products = await Reassort_ProductRepository.products(); // Charge tous les produits
  
      for (const product of products) {
        const addedAt = moment(product.date_added);
  
        // Obtenir les détails du reassort
        const reassort = await this.getReassortById(product?.reassort_id);
       
        if (reassort?.state == "automatic") {
          // Action pour 3 minutes
          if (now.diff(addedAt, "minutes") >= 3 && now.diff(addedAt, "minutes") < 4) {
            console.log(`⏳ Action 3min pour "${product.description}" (ID: ${product.id})`);
            // Ajoutez ici l'action à effectuer
          }
  
          // Action pour 24 heures
          if (now.diff(addedAt, "hours") >= 24 && now.diff(addedAt, "hours") < 25) {
            console.log(`⏳ Action 24h pour "${product.description}" (ID: ${product.id})`);
            // Ajoutez ici l'action à effectuer
          }
  
          // Action pour 30 jours
          if (now.diff(addedAt, "days") >= 3 && now.diff(addedAt, "days") < 31) {
            console.log(`⏳ Action 30d pour "${product.description}" (ID: ${product.id})`);
            // Ajoutez ici l'action à effectuer
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution de checkActions :", error);
    }
  }
  
}

// Tâche cron pour exécuter checkActions toutes les minutes
cron.schedule("* * * * *", async () => {
  console.log("🔄 Exécution de la tâche cron : vérification des actions...");
  await Reassort_ProductService.checkActions();
});

module.exports = Reassort_ProductService;


