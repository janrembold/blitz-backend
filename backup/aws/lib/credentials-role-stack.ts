import {App, Stack, StackProps} from "@aws-cdk/core";
import { Effect, IRole, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

export interface RoleStackProps extends StackProps {}

export class RoleStack extends Stack {

    readonly role: IRole;

    constructor(scope: App, id: string, props: RoleStackProps) {
        super(scope, id, props);

        this.role = new Role(this, 'LambdaRole', {
          assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        }); 

        // ToDo: Add custom policy when everything is working (maybe with CloudTrail Events)
        this.role.addToPrincipalPolicy(new PolicyStatement({
          effect: Effect.ALLOW,
          resources: ['*'],
          actions: [
            'secretsmanager:*',
            'logs:*',
            'ssmmessages:*'
          ]
        }));

        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("SecretsManagerReadWrite"));
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    }
}