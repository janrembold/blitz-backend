import {App, Stack, StackProps} from "@aws-cdk/core";
import { Effect, IRole, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

export interface RoleStackProps extends StackProps {
  stage: string
}

export class RoleStack extends Stack {

    readonly ecsTaskRole: IRole;
    readonly ecsExecutionRole: IRole;

    constructor(scope: App, id: string, props: RoleStackProps) {
        super(scope, id, props);

        this.ecsTaskRole = new Role(this, `Role-${props.stage}`, {
          assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
        }); 

        // ToDo: Add custom policy when everything is working (maybe with CloudTrail Events)
        this.ecsTaskRole.addToPrincipalPolicy(new PolicyStatement({
          effect: Effect.ALLOW,
          resources: ['*'],
          actions: [
            // 'ecr:*',
            // 'secretsmanager:*',
            'logs:*'
          ]
        }));

        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("SecretsManagerReadWrite"));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    }
}