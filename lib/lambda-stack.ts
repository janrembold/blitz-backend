import {App, Stack, StackProps} from '@aws-cdk/core';
import {Code, Function, IFunction, Runtime} from '@aws-cdk/aws-lambda';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as path from 'path';

export interface LambdaStackProps extends StackProps {
    environment?: { [key: string]: string; } | undefined;
    handler: string;
    stage: string; 
    vpc: Vpc;
}

export class LambdaStack extends Stack {

    readonly lambda: IFunction;

    constructor(scope: App, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.lambda = new Function(this, 'stepFunctionTrigger', {
            functionName: `${props.stage}-lambda`, 
            runtime: Runtime.NODEJS_14_X,
            handler: props.handler, 
            code: Code.fromAsset(path.join(__dirname, '..', 'lambda', 'dist')),
            environment: props.environment
        });
    }
}