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
exports.EcsStack = void 0;
const core_1 = require("@aws-cdk/core");
const path = __importStar(require("path"));
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_ecs_patterns_1 = require("@aws-cdk/aws-ecs-patterns");
class EcsStack extends core_1.Stack {
    constructor(scope, id, props) {
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
        const cluster = new aws_ecs_1.Cluster(this, `Cluster-${props.stage}`, {
            vpc: props.vpc,
        });
        console.log('Docker folder', path.join(__dirname, 'migrate'));
        new aws_ecs_patterns_1.ApplicationLoadBalancedFargateService(this, `FargateService-${props.stage}`, {
            cluster,
            taskImageOptions: {
                enableLogging: true,
                // executionRole: props.role,
                image: aws_ecs_1.ContainerImage.fromAsset(path.join(__dirname, '..', 'migrate'), {
                    buildArgs: {}
                }),
                environment: props.environment
            },
            publicLoadBalancer: true,
        });
    }
}
exports.EcsStack = EcsStack;
