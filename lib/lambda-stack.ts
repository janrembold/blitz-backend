import {App, Duration, Stack, StackProps} from '@aws-cdk/core';
import {Code, Function, IFunction, Runtime} from '@aws-cdk/aws-lambda';
import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import * as path from 'path';
import { IRole } from '@aws-cdk/aws-iam';

export interface LambdaStackProps extends StackProps {
    environment?: { [key: string]: string; } | undefined;
    handler: string;
    inboundDbAccessSecurityGroup: string;
    role: IRole;
    stage: string; 
    vpc: Vpc;
}

export class LambdaStack extends Stack {

    readonly lambda: IFunction;

    constructor(scope: App, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.lambda = new Function(this, 'LambdaFunction', {
            runtime: Runtime.NODEJS_14_X,
            handler: props.handler, 
            code: Code.fromAsset(path.join(__dirname, '..', 'lambda', 'dist')),
            // timeout: Duration.minutes(1),
            environment: props.environment,
            role: props.role,
            vpc: props.vpc,
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(this, 'inboundDbAccessSecurityGroup' + id, props.inboundDbAccessSecurityGroup)
            ]
        });
    }
}