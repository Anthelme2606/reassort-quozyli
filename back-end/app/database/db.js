const mysql = require('mysql2/promise');
const sequelize = require('./database');
const { Sequelize } = require('sequelize');
const alterTable =require("./revision");
async function createDatabaseIfNotExists(dbName) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const [rows] = await connection.query(`SHOW DATABASES LIKE '${dbName}'`);

  if (rows.length === 0) {
    console.log(`La base de données '${dbName}' n'existe pas. Création en cours...`);
    await connection.query(`CREATE DATABASE ${dbName}`);
    console.log(`La base de données '${dbName}' a été créée avec succès.`);
  }

  await connection.end();
}

// Exemple de modifications de table
const tableName = 'reassort_products';
// const modifications = [
//   { action: 'MODIFY', column: 'schedule_date', options: "DEFAULT CURRENT_TIMESTAMP + INTERVAL 30 DAY" },
// ];
const modifications = [
  { action: 'ADD', column: 'titre',options: "TEXT DEFAULT ''" },
];


// async function alterTable(sequelize, tableName, modifications) {
//   const queryInterface = sequelize.getQueryInterface();
  
//   for (let modification of modifications) {
//     if (modification.action === 'ADD') {
//       try {
//         await queryInterface.addColumn(tableName, modification.column, Sequelize[modification.options]);
//         console.log(`Colonne ${modification.column} ajoutée à la table ${tableName}`);
//       } catch (err) {
//         console.error(`Erreur lors de l'ajout de la colonne ${modification.column}:`, err);
//       }
//     }
//   }
// }

async function startDatabase() {
  try {
    const dbName = process.env.DB_NAME;
    await createDatabaseIfNotExists(dbName);
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchronisation des modèles (sans suppression des données existantes)
    await sequelize.sync({ force: false }).then(() => {
      console.log("Les tables sont synchronisées avec succès");
    }).catch(err => {
      console.error("Erreur de synchronisation :", err);
    });

    // Appliquer les modifications de la table
    //await alterTable(sequelize, tableName, modifications);

  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}

module.exports = startDatabase;
