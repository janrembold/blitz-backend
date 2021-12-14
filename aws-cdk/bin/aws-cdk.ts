#!/usr/bin/env node
import { App as AwsApp } from '@aws-cdk/core';
import 'source-map-support/register';
import { EcsStack } from '../lib/ecs-stack';
import { RDSStack } from '../lib/rds-stack';
import { RoleStack } from '../lib/role-stack';
import { VpcStack } from '../lib/vpc-stack';

const stage = process.env.TRAVIS_BRANCH || process.env.STAGE || 'local';

const app = new AwsApp();

const vpcStack = new VpcStack(app, `VpcStack-${stage}`, { stage });

const roleStack = new RoleStack(app, `RoleStack-${stage}`, { stage });

const dbStack = new RDSStack(app, `RDSStack-${stage}`, {
  vpc: vpcStack.vpc,
  role: roleStack.ecsTaskRole,
  inboundDbAccessSecurityGroup: vpcStack.ingressSecurityGroup.securityGroupName,
  stage,
});

new EcsStack(app, `FargateStack-${stage}`, {
  vpc: vpcStack.vpc,
  stage,
  role: roleStack.ecsTaskRole,
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECRET_ARN: dbStack.secret.secretArn,
    DB_NAME: 'blitz',
    DB_HOST: dbStack.postgresInstance.dbInstanceEndpointAddress,
    DB_PORT: dbStack.postgresInstance.dbInstanceEndpointPort,
  },
});
