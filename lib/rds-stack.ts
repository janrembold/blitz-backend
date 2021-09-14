import {App, CfnOutput, Stack, StackProps} from "@aws-cdk/core";
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, IDatabaseInstance, PostgresEngineVersion} from '@aws-cdk/aws-rds';
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import {InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc} from "@aws-cdk/aws-ec2";

export interface RDSStackProps extends StackProps {
    vpc: Vpc;
    stage: string; 
}

export class RDSStack extends Stack {

    readonly secret: ISecret;
    readonly postgresInstance: IDatabaseInstance;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

        // this.secret = Secret.fromSecretAttributes(this, 'PostgresPassword', {
        //     secretArn: 'arn:aws:secretsmanager:{region}:{organisation-id}:secret:PostgresSecret',
        // });

        this.secret = new Secret(this, `${props.stage}-DBCredentialsSecret`, {
            secretName: `${props.stage}-credentials`,
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                username: 'postgres',
                }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password'
            }
        });  
        
        new CfnOutput(this, 'Secret Name', { value: this.secret.secretName }); 
        new CfnOutput(this, 'Secret ARN', { value: this.secret.secretArn }); 
        new CfnOutput(this, 'Secret Full ARN', { value: this.secret.secretFullArn || '' });
        
        this.postgresInstance = new DatabaseInstance(this, 'postgres-rds-instance', {
            engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_3 }),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            vpc: props.vpc,
            vpcPlacement: {subnetType: SubnetType.PRIVATE_ISOLATED},
            storageEncrypted: true,
            databaseName: `${props.stage}-blitz`,
            credentials: Credentials.fromGeneratedSecret('postgres')
            // multiAz: false,
            // autoMinorVersionUpgrade: false,
            // allocatedStorage: 25,
            // storageType: StorageType.GP2,
            // backupRetention: Duration.days(3),
            // deletionProtection: false,
            // masterUserPassword: this.secret.secretValue,
            // port: 3306
        });    
    }
}