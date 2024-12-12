const Reassort_ProductModel = require('../../models/reassort_products/reassort_productsModel');
const ReassortModel = require('../../models/reassort_products/reassortModel');
const { Op } = require('sequelize');

class Reassort_ProductRepository {
    // Method to create a new Reassort
    static async createReassort(data) {
        try {
            const existingReassort = await ReassortModel.findOne({ where: { user_id: data.user_id } });
            if (existingReassort) {
                throw new Error('User already has a Reassort');
            }

            const newReassort = await ReassortModel.create(data);
            return newReassort;
        } catch (error) {
            throw error;
        }
    }

    // Method to add a product to a Reassort
    static async addToReassort(data) {
        try {
            let reassort = await ReassortModel.findOne({ where: { user_id: data.user_id } });
            if (!reassort) {
                reassort = await this.createReassort({ user_id: data.user_id });
            }

            const existingProduct = await Reassort_ProductModel.findOne({
                where: {
                    product_id: data.product_id,
                    reassort_id: reassort.id,
                },
            });
            
            if (existingProduct) {
                existingProduct.stock_quantity += data?.stock_quantity || 1;
                await existingProduct.save();
                return existingProduct;
            } else {
                const newProduct = await Reassort_ProductModel.create({
                    ...data,
                    reassort_id: reassort.id,
                });
                return newProduct;
            }
        } catch (error) {
            throw error;
        }
    }
    static async getProducts(rea_id){
        try{
     const products= await Reassort_ProductModel.findAll({where:{
        reassort_id:rea_id,
     }});
     if(!products){
        return [];
     }
     return products;
        }catch(error){
            throw error;
        }
    }

    // Method to remove a product from Reassort
    static async removeProductFromReassort(data) {
        try {
            const reassort = await ReassortModel.findOne({
                where: {
                    id: data.reassort_id,
                    user_id: data.user_id,
                    state: 'automatic',
                    // schedule_date: { [Op.gte]: new Date(Date.now() + 72 * 60 * 60 * 1000) }, // 72 hours ahead
                },
            });
      console.log(reassort);
            if (!reassort) {
                throw new Error(
                    'Cannot remove the product. Reassort must be in "automatic" state and schedule_date must be more than 72 hours away.'
                );
            }

            const product = await Reassort_ProductModel.findOne({
                where: {
                    reassort_id: data.reassort_id,
                    id: data.product_id,
                },
            });

            if (!product) {
                throw new Error('Product not found in the Reassort.');
            }

           return  await product.destroy();
          //  return { message: 'Product removed successfully from the Reassort.' };
        } catch (error) {
            throw error;
        }
    }
static async getReassort(user_id){
    try{
    const reassort=await ReassortModel.findOne({where:{
        user_id
    }});
    if(!reassort){
        return null;
    }
    return reassort;
    }catch(error){
        throw error;
    }
}
static async products(){
    try{
       return await Reassort_ProductModel.findAll();
   
    }catch(error){
        throw error;
    }
}
static async getReassortById(id){
    try{
    const reassort=await ReassortModel.findByPk(id);
    if(!reassort){
        return null;
    }
    return reassort;
    }catch(error){
        throw error;
    }
}
    // Method to plan a Reassort (automatic/manual)
    static async PlanReassort(reassort_id, state) {
        try {
            const reassort = await ReassortModel.findByPk(reassort_id);
            if (!reassort) throw new Error('Reassort not found');

            if (state === 'automatic' && new Date(reassort.schedule_date) <= new Date(Date.now() + 72 * 60 * 60 * 1000)) {
                throw new Error('Cannot plan the Reassort in "automatic" state within 72 hours of schedule_date');
            }

            reassort.state = state;
            await reassort.save();
            return reassort;
        } catch (error) {
            throw error;
        }
    }

    // Method to decrease product quantity
    static async decreaseQuantity(product_id, quantity) {
        try {
            const product = await Reassort_ProductModel.findByPk(product_id);
            if (!product) throw new Error('Product not found');

            const reassort = await ReassortModel.findByPk(product.reassort_id);
            if (reassort.state === 'automatic' && new Date(reassort.schedule_date) <= new Date(Date.now() + 72 * 60 * 60 * 1000)) {
                throw new Error('Cannot decrease quantity within 72 hours of schedule_date in automatic state');
            }

            product.stock_quantity = Math.max(product.stock_quantity - quantity, 0);
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    }

    // Method to increase product quantity
    static async increaseQuantity(product_id, quantity) {
        try {
            const product = await Reassort_ProductModel.findByPk(product_id);
            if (!product) throw new Error('Product not found');

            const reassort = await ReassortModel.findByPk(product.reassort_id);
            if (reassort.state === 'automatic' && new Date(reassort.schedule_date) <= new Date(Date.now() + 72 * 60 * 60 * 1000)) {
                throw new Error('Cannot increase quantity within 72 hours of schedule_date in automatic state');
            }

            product.stock_quantity += quantity;
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    }
    static async updateQuantity(productId, quantity) {
        try {
           
            const product = await Reassort_ProductModel.findOne({ where: { id: productId } });

            if (!product) {
                throw new Error("Produit non trouvé");
            }

           
            product.stock_quantity = quantity;
            await product.save();

           
            return product;

        } catch (error) {
         
            throw error;
        }
    }
    static async toggleState(reassortId) {
        try {
          
            const reassort = await ReassortModel.findOne({ where: { id: reassortId } });

            if (!reassort) {
                throw new Error("Reassort not found");
            }

            // Logique de bascule de l'état
            const newState = reassort.state === 'automatic' ? 'manual' : 'automatic';
           return await reassort.update({ state: newState });

            
            

        } catch (error) {
            throw error; 
        }
    }

    // Cron job for automatic Reassort notifications
    static async cronJob() {
        try {
            const reassorts = await ReassortModel.findAll({
                where: {
                    schedule_date: { [Op.between]: [new Date(), new Date(Date.now() + 72 * 60 * 60 * 1000)] },
                    state: 'automatic',
                },
            });

            for (const reassort of reassorts) {
                console.log(`Notify user ${reassort.user_id}: Your Reassort is due soon.`);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Reassort_ProductRepository;
