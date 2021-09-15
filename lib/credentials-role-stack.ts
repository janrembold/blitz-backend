import {App, Stack, StackProps} from "@aws-cdk/core";
import { IRole, ManagedPolicy, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

export interface CredentialsRoleStackProps extends StackProps {}

export class CredentialsRoleStack extends Stack {

    readonly role: IRole;

    constructor(scope: App, id: string, props: CredentialsRoleStackProps) {
        super(scope, id, props);

        this.role = new Role(this, "RDSCredentialsRole", {
          assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
          description: 'RDSCredentialsRole'
        }); 
                
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("SecretsManagerReadWrite"));
    }
}