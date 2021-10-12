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
const getAwsSecret_1 = require("./utils/getAwsSecret");
// const bootstrap = async () => {
//   const secret = await getAwsSecret(process.env.SECRET_ARN);
//   //ToDo: Run postgres migration
// }
(0, getAwsSecret_1.getAwsSecret)(process.env.SECRET_ARN).then(secret => {
    console.log('Secret', secret);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 5)}`);
    }));
    const url = `postgres://postgres:${secret}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log('url', url);
    // app.use(
    //     postgraphile(
    //         url,
    //         "public",
    //         {
    //             watchPg: true,
    //             graphiql: true,
    //             enhanceGraphiql: true,
    //             jwtSecret: 'supersecretjwttokenpass',
    //             jwtPgTypeIdentifier: 'public.jwt_token',
    //             // pgDefaultRole: 'user_guest'
    //         } 
    //     )
    // );
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`server is running on PORT ${port}`);
    });
}).catch(error => {
    console.log('Error while loading secret');
    console.log(error);
});
