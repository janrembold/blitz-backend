"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class RoleStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.role = new aws_iam_1.Role(this, 'LambdaRole', {
            assumedBy: new aws_iam_1.ServicePrincipal("lambda.amazonaws.com"),
        });
        // ToDo: Add custom policy when everything is working (maybe with CloudTrail Events)
        this.role.addToPrincipalPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: ['*'],
            actions: [
                'secretsmanager:*',
                'logs:*',
                'ssmmessages:*'
            ]
        }));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));
        // this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("SecretsManagerReadWrite"));
        this.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
        this.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    }
}
exports.RoleStack = RoleStack;
