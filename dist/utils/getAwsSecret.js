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
exports.getAwsSecret = void 0;
const aws_sdk_1 = require("aws-sdk");
const region = process.env.AWS_DEFAULT_REGION || 'eu-central-1';
const SecretsManagerInstance = new aws_sdk_1.SecretsManager({ region });
const getAwsSecret = (secretName = '') => __awaiter(void 0, void 0, void 0, function* () {
    const rawSecret = yield SecretsManagerInstance.getSecretValue({ SecretId: secretName }).promise();
    console.log('rawSecret', typeof rawSecret, rawSecret.SecretString, rawSecret);
    return rawSecret.SecretString;
});
exports.getAwsSecret = getAwsSecret;
