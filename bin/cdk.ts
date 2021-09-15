#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import { VpcStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { CredentialsRoleStack } from '../lib/credentials-role-stack';

dotenv.config();
console.log('AWS Account', process.env.AWS_ACCOUNT_NUMBER);

const stage = process.env.STAGE || 'local';

const app = new cdk.App();
const vpcStack  = new VpcStack(app, 'VpcStack');

const credentialsRoleStack = new CredentialsRoleStack(app, 'CredentialsRoleStack', {})

const dbStack = new RDSStack(app, 'RDSStack', {
  vpc: vpcStack.vpc,
  role: credentialsRoleStack.role,
  stage
});

const postgraphileLambdaStack = new LambdaStack(app, 'PostgraphileExpress', {
  handler: 'postgraphile/index.express',
  role: credentialsRoleStack.role,
  vpc: vpcStack.vpc,
  stage,
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECRET_ARN: dbStack.secret.secretArn,
    DB_NAME: 'blitz', 
    DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
    DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
  } 
});

new ApiGatewayStack(app, 'ApiGatewayStack', {
  handler: postgraphileLambdaStack.lambda,
  vpc: vpcStack.vpc,
  stage
});