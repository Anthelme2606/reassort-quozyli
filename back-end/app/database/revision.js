
// Fonction pour exécuter une commande ALTER TABLE
async function alterTable(sequelize, tableName, modifications) {
  try {
    // Construction de la commande ALTER TABLE
    const alterCommands = modifications.map(mod => {
      const { action, column, options } = mod;
      // Exemples d'actions : 'ADD', 'DROP', 'MODIFY'
      return `${action} ${column} ${options}`;
    }).join(', ');

    const sql = `ALTER TABLE ${tableName} ${alterCommands};`;

    // Exécution de la commande SQL
    await sequelize.query(sql);
    console.log(`La table '${tableName}' a été modifiée avec succès.`);

  } catch (error) {
    console.error('Erreur lors de la modification de la table :', error);
  }
}







module.exports=alterTable;
