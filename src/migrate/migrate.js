const { SlonikMigrator } = require('@slonik/migrator');
const { createPool } = require('slonik');
const path = require('path');

export const migrateUp = async (connectionString) => {
  const migrationFiles = path.join(__dirname, 'migrations');
  const slonik = createPool(connectionString);
  const migrator = new SlonikMigrator({
    migrationsPath: migrationFiles,
    migrationTableName: 'migration',
    slonik,
  });

  await migrator.up();
  console.info('Migrations completed');
};
