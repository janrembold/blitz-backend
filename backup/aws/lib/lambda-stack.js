"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const path = __importStar(require("path"));
class LambdaStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.lambda = new aws_lambda_1.Function(this, 'LambdaFunction', {
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: props.handler,
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'dist')),
            // timeout: Duration.minutes(1),
            environment: props.environment,
            role: props.role,
            vpc: props.vpc,
            // securityGroups: [
            //     SecurityGroup.fromSecurityGroupId(this, 'inboundDbAccessSecurityGroup' + id, props.inboundDbAccessSecurityGroup),
            //     SecurityGroup.fromSecurityGroupId(this, 'outboundDbAccessSecurityGroup' + id, props.outboundDbAccessSecurityGroup)
            // ]
        });
    }
}
exports.LambdaStack = LambdaStack;
