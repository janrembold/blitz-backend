const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

export const migrateUp = async (connectionString) => {
  const migrationFiles = path.join(__dirname, '..', 'migrations', '*.js');
  const sequelize = new Sequelize(connectionString);

  console.log('migrationFiles', migrationFiles);

  const umzug = new Umzug({
    migrations: { glob: migrationFiles },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
};
