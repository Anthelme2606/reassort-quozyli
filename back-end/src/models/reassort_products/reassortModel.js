const { DataTypes ,Sequelize} = require('sequelize');
const sequelize = require('../../../app/database/database');
// const User = require('./User'); // Modèle utilisateur pour la relation

const Reassort = sequelize.define('Reassort', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Incrémentation automatique
        primaryKey: true,    // Défini comme clé primaire
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    state: {
        type: DataTypes.ENUM('automatic', 'manual'),
        defaultValue: 'automatic',
    },
  schedule_date: {
    
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 30 DAY')
},

}, {
    tableName: 'reassorts',
    timestamps: true,
});

// Relation avec l'utilisateur
// Reassort.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Reassort;
