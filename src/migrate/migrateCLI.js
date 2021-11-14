const { SlonikMigrator } = require('@slonik/migrator');
const { createPool } = require('slonik');
const path = require('path');

// export const migrateUp = async () => {
const migrationFiles = path.join(__dirname, 'migrations');
const slonik = createPool(process.env.DEV_CONNECTION);

console.log('migrationFiles', migrationFiles);

const migrator = new SlonikMigrator({
  migrationsPath: migrationFiles,
  migrationTableName: 'migration',
  slonik,
});

migrator.runAsCLI();
// };
