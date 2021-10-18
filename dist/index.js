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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const postgraphile_1 = __importDefault(require("postgraphile"));
const getAwsSecret_1 = require("./utils/getAwsSecret");
const pg_1 = require("pg");
const umzug_1 = require("./umzug/umzug");
// Add https://github.com/sequelize/umzug
// Add https://github.com/graphile/worker OR https://github.com/timgit/pg-boss
const getDbConnectionString = () => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, host, port, dbname } = yield (0, getAwsSecret_1.getAwsSecret)(process.env.SECRET_ARN);
    // const connectionString = `postgresql://postgres:${credentials.password}@${process.env.DB_HOST}:5432/blitz`;
    return `postgres://${username}:${password}@${host}:${port}/${dbname}`;
});
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectionString = yield getDbConnectionString();
    console.log('connectionString', connectionString);
    if (!connectionString) {
        throw Error('Fetch AWS Secret failed');
    }
    yield (0, umzug_1.migrateUp)(connectionString);
    const pool = new pg_1.Pool({ connectionString });
    console.log('Pool created');
    try {
        console.log('Fire SELECT NOW');
        const res = yield pool.query('SELECT NOW()');
        console.log('SELECT NOW', res);
        // await pool.end();
    }
    catch (err) {
        console.error('SELECT NOW ERROR', err);
    }
    //ToDo: Run postgres migration
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 10)}`);
    }));
    app.use((0, postgraphile_1.default)(connectionString, "public", {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        // jwtSecret: 'supersecretjwttokenpass',
        // jwtPgTypeIdentifier: 'public.jwt_token',
        // pgDefaultRole: 'user_guest'
    }));
    const expressPort = process.env.PORT || 8080;
    const server = app.listen(expressPort, () => {
        console.log(`Blitz Backend is running on PORT ${expressPort}`);
    });
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing Express server');
        server.close(() => {
            console.log('Express server successfully closed');
        });
    });
});
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
