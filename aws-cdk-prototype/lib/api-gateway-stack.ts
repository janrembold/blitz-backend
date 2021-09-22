import {App, Stack, StackProps} from "@aws-cdk/core";
import s3 = require('@aws-cdk/aws-s3');
import * as lambda from '@aws-cdk/aws-lambda';
import { Vpc } from "@aws-cdk/aws-ec2";
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export interface ApiGatewayStackProps extends StackProps {
    handler: lambda.IFunction;
    stage: string; 
    vpc: Vpc;
}

export class ApiGatewayStack extends Stack {

    readonly apiGateway: LambdaRestApi;
    
    constructor(scope: App, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);

        this.apiGateway = new LambdaRestApi(this, `ApiGateway`, {
            handler: props.handler,        
        });
    }
}