"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateUp = void 0;
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const migrateUp = (connectionString) => __awaiter(void 0, void 0, void 0, function* () {
    const migrationFiles = path.join(__dirname, '..', 'migrations', '*.js');
    const sequelize = new Sequelize(connectionString);
    console.log('migrationFiles', migrationFiles);
    const umzug = new Umzug({
        migrations: { glob: migrationFiles },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    });
    yield umzug.up();
});
exports.migrateUp = migrateUp;
