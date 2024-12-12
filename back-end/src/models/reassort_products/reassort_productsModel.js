const { DataTypes } = require('sequelize');
const sequelize = require('../../../app/database/database');
const Reassort = require('./reassortModel');

const ReassortProduct = sequelize.define('ReassortProduct', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true,    
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // ID du produit transmis via JSON
    },
    reassort_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    titre: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.ENUM('in_stock', 'out_of_stock', 'pending', 'scheduled'),
        defaultValue: 'pending',
    },
    date_added: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'reassort_products',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['product_id', 'reassort_id'],
        },
    ],
});

// Relation avec Reassort
ReassortProduct.belongsTo(Reassort, { foreignKey: 'reassort_id' });

module.exports = ReassortProduct;
