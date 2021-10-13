#!/usr/bin/env node
import 'source-map-support/register';
import { App as AwsApp } from '@aws-cdk/core';

import { VpcStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { EcsStack } from '../lib/ecs-stack';
import { RoleStack } from '../lib/role-stack';

const stage = process.env.TRAVIS_BRANCH || process.env.STAGE || 'local';

const app = new AwsApp();

const vpcStack  = new VpcStack(app, `VpcStack-${stage}`, { stage });

const roleStack = new RoleStack(app, `RoleStack-${stage}`, { stage })

const dbStack = new RDSStack(app, `RDSStack-${stage}`, {
  vpc: vpcStack.vpc,
  role: roleStack.role,
  // inboundDbAccessSecurityGroup: vpcStack.ingressSecurityGroup.securityGroupName,
  stage
});

const fargateStack = new EcsStack(app, `FargateStack-${stage}`, {
  vpc: vpcStack.vpc,
  stage,
  role: roleStack.role,
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECRET_ARN: dbStack.secret.secretArn,
    DB_NAME: 'blitz', 
    DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
    DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
  } 
});
