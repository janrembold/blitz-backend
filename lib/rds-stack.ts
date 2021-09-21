import {App, CfnOutput, Duration, Stack, StackProps} from "@aws-cdk/core";
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, IDatabaseInstance, PostgresEngineVersion} from '@aws-cdk/aws-rds';
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import {InstanceClass, InstanceSize, InstanceType, SecurityGroup, SubnetType, Vpc} from "@aws-cdk/aws-ec2";
import { IRole } from "@aws-cdk/aws-iam";

export interface RDSStackProps extends StackProps {
    vpc: Vpc;
    inboundDbAccessSecurityGroup: string;
    role: IRole;
    stage: string; 
}

export class RDSStack extends Stack {

    readonly secret: ISecret;
    readonly postgresInstance: IDatabaseInstance;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

        const dbUsername = 'postgres';

        this.secret = new Secret(this, `DBCredentials`, {
            secretName: `${props.stage}-credentials`,           
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: dbUsername,
                }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password',
                passwordLength: 16
            },
        });
        
        this.postgresInstance = new DatabaseInstance(this, 'PostgresInstance', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_3 }),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            vpc: props.vpc,
            vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
            // vpcPlacement: { subnetType: SubnetType.PRIVATE_ISOLATED },
            storageEncrypted: true,
            databaseName: 'blitz',
            credentials: Credentials.fromSecret(this.secret, dbUsername),
            allocatedStorage: 5,
            securityGroups: [
                SecurityGroup.fromSecurityGroupId(this, 'inboundDbAccessSecurityGroup' + id, props.inboundDbAccessSecurityGroup)
            ]
            // backupRetention: Duration.days(3),
            // publiclyAccessible: false,
            // multiAz: false,
            // storageType: StorageType.GP2,
            // deletionProtection: false,
        });    
        
        this.secret.grantRead(props.role);
        this.postgresInstance.grantConnect(props.role);
        
        new CfnOutput(this, 'Secret ARN', { value: this.secret.secretArn }); 
    }
}