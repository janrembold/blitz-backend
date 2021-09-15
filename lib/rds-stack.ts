import {App, CfnOutput, Duration, Stack, StackProps} from "@aws-cdk/core";
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, IDatabaseInstance, PostgresEngineVersion} from '@aws-cdk/aws-rds';
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import {InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc} from "@aws-cdk/aws-ec2";
import { IRole } from "@aws-cdk/aws-iam";

export interface RDSStackProps extends StackProps {
    vpc: Vpc;
    role: IRole;
    stage: string; 
}

export class RDSStack extends Stack {

    readonly databaseName: string;
    readonly secret: ISecret;
    readonly postgresInstance: IDatabaseInstance;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

        this.databaseName = `blitz${props.stage}`;

        this.secret = new Secret(this, `${props.stage}-DBCredentialsSecret`, {
            secretName: `${props.stage}-credentials`,           
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: 'postgres',
                }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password',
                passwordLength: 16
            }
        });  

        this.secret.grantRead(props.role);
        
        this.postgresInstance = new DatabaseInstance(this, 'postgres-rds-instance', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_3 }),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            vpc: props.vpc,
            vpcPlacement: {subnetType: SubnetType.PRIVATE_ISOLATED},
            storageEncrypted: true,
            databaseName: this.databaseName,
            credentials: Credentials.fromGeneratedSecret('postgres'),
            backupRetention: Duration.days(3),
            publiclyAccessible: false
            // multiAz: false,
            // allocatedStorage: 25,
            // storageType: StorageType.GP2,
            // deletionProtection: false,
        });    
        
        new CfnOutput(this, 'Secret ARN', { value: this.secret.secretArn }); 
    }
}