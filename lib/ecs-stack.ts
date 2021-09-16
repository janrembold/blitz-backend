import {App, Stack, StackProps} from '@aws-cdk/core';
import {IVpc} from '@aws-cdk/aws-ec2'
import { IRole } from '@aws-cdk/aws-iam';

export interface EcsStackProps extends StackProps {
    role: IRole;
    vpc: IVpc;
}

export class EcsStack extends Stack {

    constructor(scope: App, id: string, props?: EcsStackProps) {
        super(scope, id, props);

        
    }
}