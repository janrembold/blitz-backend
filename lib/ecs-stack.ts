import {App, Stack, StackProps} from '@aws-cdk/core';
import { IVpc } from '@aws-cdk/aws-ec2'
import * as path from 'path';

import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

export interface EcsStackProps extends StackProps {
    // role: IRole;
    environment?: { [key: string]: string; } | undefined;
    vpc: IVpc;
}

export class EcsStack extends Stack {

    constructor(scope: App, id: string, props: EcsStackProps) {
        super(scope, id, props);

        const cluster = new Cluster(this, "DBMigrationCluster", {
            vpc: props.vpc
        });

        console.log('Docker folder', path.join(__dirname, 'migrate'));
        new ApplicationLoadBalancedFargateService(this, 'DBMigrationService', {
            cluster,
            taskImageOptions: {
                image: ContainerImage.fromAsset(path.join(__dirname, '..', 'migrate')),
                environment: props.environment
            },
            publicLoadBalancer: false,
        });    
    }
}