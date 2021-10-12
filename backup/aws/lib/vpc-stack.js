"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
class VpcStack extends core_1.Stack {
    // readonly ingressSecurityGroup: SecurityGroup;
    // readonly egressSecurityGroup: SecurityGroup;
    constructor(scope, id, props) {
        super(scope, id, props);
        // this.vpc = new Vpc(this, 'IsolatedVPC', {
        //     // cidr: '10.0.0.0/16',
        //     maxAzs: 2,
        //     natGateways: 0,
        //     subnetConfiguration: [{
        //         // cidrMask: 26,
        //         name: 'isolatedSubnet',
        //         subnetType: SubnetType.PUBLIC,
        //     }],
        // });
        this.vpc = new aws_ec2_1.Vpc(this, `VPC-${props.stage}`, {
            maxAzs: 2
        });
        // this.ingressSecurityGroup = new SecurityGroup(this, `ingress-security-group`, {
        //     vpc: this.vpc,
        //     allowAllOutbound: true,
        // });
        // this.ingressSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(5432));
        // this.egressSecurityGroup = new SecurityGroup(this, 'egress-security-group', {
        //     vpc: this.vpc,
        //     allowAllOutbound: false,
        // });
        // this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));
        // this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(443));
    }
}
exports.VpcStack = VpcStack;
