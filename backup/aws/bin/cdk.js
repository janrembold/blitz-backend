#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const core_1 = require("@aws-cdk/core");
const dotenv = __importStar(require("dotenv"));
const vpc_stack_1 = require("../lib/vpc-stack");
const rds_stack_1 = require("../lib/rds-stack");
const ecs_stack_1 = require("../lib/ecs-stack");
// import { RoleStack } from '../lib/credentials-role-stack';
// import * as path from 'path';
// import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
dotenv.config();
console.log('AWS Account', process.env.AWS_ACCOUNT_NUMBER);
const stage = process.env.TRAVIS_BRANCH || 'local';
const app = new core_1.App();
const vpcStack = new vpc_stack_1.VpcStack(app, `VpcStack-${stage}`, {
    stage
});
// const roleStack = new RoleStack(app, `RoleStack-${stage}`, {})
const dbStack = new rds_stack_1.RDSStack(app, `RDSStack-${stage}`, {
    vpc: vpcStack.vpc,
    // role: roleStack.role,
    // inboundDbAccessSecurityGroup: vpcStack.ingressSecurityGroup.securityGroupName,
    stage
});
const fargateStack = new ecs_stack_1.EcsStack(app, `FargateStack-${stage}`, {
    vpc: vpcStack.vpc,
    stage,
    // role: roleStack.role,
    environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        SECRET_ARN: dbStack.secret.secretArn,
        DB_NAME: 'blitz',
        DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
        DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
    }
});
// const postgraphileLambdaStack = new LambdaStack(app, 'PostgraphileExpressStack', {
//   handler: 'index.express',
//   role: roleStack.role,
//   vpc: vpcStack.vpc,
//   stage,
//   // inboundDbAccessSecurityGroup: vpcStack.ingressSecurityGroup.securityGroupName,
//   // outboundDbAccessSecurityGroup: vpcStack.egressSecurityGroup.securityGroupName,
//   environment: {
//     AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
//     SECRET_ARN: dbStack.secret.secretArn,
//     DB_NAME: 'blitz', 
//     DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
//     DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
//   } 
// });
// new ApiGatewayStack(app, 'ApiGatewayStack', {
//   handler: postgraphileLambdaStack.lambda,
//   vpc: vpcStack.vpc,
//   stage
// });
