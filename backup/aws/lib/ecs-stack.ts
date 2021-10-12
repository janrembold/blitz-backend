import {App, Stack, StackProps} from '@aws-cdk/core';
import { IVpc } from '@aws-cdk/aws-ec2'
import * as path from 'path';

import { AsgCapacityProvider, Cluster, ContainerImage, EcsOptimizedImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { IRole } from '@aws-cdk/aws-iam';

export interface EcsStackProps extends StackProps {
    // role: IRole;
    environment?: { [key: string]: string; } | undefined;
    stage: string;
    vpc: IVpc;
}

export class EcsStack extends Stack {

    constructor(scope: App, id: string, props: EcsStackProps) {
        super(scope, id, props);

        // const autoScalingGroup = new AsgCapacityProvider.autoScalingGroup(stack, 'ASG', {
        //     vpc: props.vpc,
        //     instanceType: new InstanceType('t2.micro'),
        //     machineImage: EcsOptimizedImage.amazonLinux2(),
        //     minCapacity: 0,
        //     maxCapacity: 100,
        // });

        // const capacityProvider = new AsgCapacityProvider(this, 'AsgCapacityProvider', {
        //     autoScalingGroup,
        // });

        // cluster.addAsgCapacityProvider() .addCapacity('DefaultAutoScalingGroup', {
        //     instanceType: new InstanceType('t2.micro')
        // });

        const cluster = new Cluster(this, `Cluster-${props.stage}`, {
            vpc: props.vpc,
        });

        console.log('Docker folder', path.join(__dirname, 'migrate'));

        new ApplicationLoadBalancedFargateService(this, `FargateService-${props.stage}`, {
            cluster,
            taskImageOptions: {
                enableLogging: true,
                // executionRole: props.role,
                image: ContainerImage.fromAsset(path.join(__dirname, '..', 'migrate'), {
                    buildArgs: {}
                }),
                environment: props.environment
            },
            publicLoadBalancer: true,
        });    
    }
}