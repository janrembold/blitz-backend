"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_rds_1 = require("@aws-cdk/aws-rds");
const aws_secretsmanager_1 = require("@aws-cdk/aws-secretsmanager");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
class RDSStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dbUsername = 'postgres';
        this.secret = new aws_secretsmanager_1.Secret(this, `DBCredentials-${props.stage}`, {
            // secretName: `${props.stage}-credentials`,           
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
        this.postgresInstance = new aws_rds_1.DatabaseInstance(this, `PostgresInstance-${props.stage}`, {
            engine: aws_rds_1.DatabaseInstanceEngine.postgres({ version: aws_rds_1.PostgresEngineVersion.VER_13_3 }),
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.T3, aws_ec2_1.InstanceSize.MICRO),
            vpc: props.vpc,
            // vpcSubnets: { subnetType: SubnetType.PUBLIC },
            // vpcPlacement: { subnetType: SubnetType.PRIVATE_ISOLATED },
            storageEncrypted: true,
            databaseName: 'blitz',
            credentials: aws_rds_1.Credentials.fromSecret(this.secret, dbUsername),
            allocatedStorage: 5,
            // securityGroups: [
            //     SecurityGroup.fromSecurityGroupId(this, 'inboundDbAccessSecurityGroup' + id, props.inboundDbAccessSecurityGroup)
            // ]
            // backupRetention: Duration.days(3),
            // publiclyAccessible: false,
            // multiAz: false,
            // storageType: StorageType.GP2,
            // deletionProtection: false,
        });
        // this.secret.grantRead(props.role);
        // this.postgresInstance.grantConnect(props.role);
        new core_1.CfnOutput(this, 'Secret ARN', { value: this.secret.secretArn });
    }
}
exports.RDSStack = RDSStack;
