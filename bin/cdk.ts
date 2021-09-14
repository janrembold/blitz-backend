#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import { VpcStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';

dotenv.config();
console.log('AWS Account', process.env.AWS_ACCOUNT_NUMBER);

const stage = process.env.STAGE || 'stage-not-set';

const app = new cdk.App();
const vpcStack  = new VpcStack(app, 'VpcStack');

const dbStack = new RDSStack(app, 'RDSStack', {
  vpc: vpcStack.vpc,
  stage
});

const postgraphileLambdaStack = new LambdaStack(app, 'PostgraphileExpress', {
  handler: 'postgraphile/index.express',
  vpc: vpcStack.vpc,
  stage,
  environment: {
    DB_USER: 'postgres', // ???
    DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
    DB_NAME: 'mydb', // ???
    DB_PASSWORD: 'secretpassword', // ???
    DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
  } 
});

new ApiGatewayStack(app, 'ApiGatewayStack', {
  handler: postgraphileLambdaStack.lambda,
  vpc: vpcStack.vpc,
  stage
});