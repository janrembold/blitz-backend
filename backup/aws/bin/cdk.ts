#!/usr/bin/env node
import 'source-map-support/register';
import { App as AwsApp } from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import { VpcStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { EcsStack } from '../lib/ecs-stack';
// import { RoleStack } from '../lib/credentials-role-stack';
// import * as path from 'path';
// import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';

dotenv.config();
console.log('AWS Account', process.env.AWS_ACCOUNT_NUMBER);

const stage = process.env.TRAVIS_BRANCH || 'local';

const app = new AwsApp();

const vpcStack  = new VpcStack(app, `VpcStack-${stage}`, {
  stage
});

// const roleStack = new RoleStack(app, `RoleStack-${stage}`, {})

const dbStack = new RDSStack(app, `RDSStack-${stage}`, {
  vpc: vpcStack.vpc,
  // role: roleStack.role,
  // inboundDbAccessSecurityGroup: vpcStack.ingressSecurityGroup.securityGroupName,
  stage
});

const fargateStack = new EcsStack(app, `FargateStack-${stage}`, {
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
