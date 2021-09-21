import {App, Stack, StackProps} from '@aws-cdk/core';
import {GatewayVpcEndpoint, GatewayVpcEndpointAwsService, Peer, Port, SecurityGroup, SubnetType, Vpc} from '@aws-cdk/aws-ec2'

export interface VpcStackProps extends StackProps {
    stage: string;  
}

export class VpcStack extends Stack {
    readonly vpc: Vpc;
    readonly ingressSecurityGroup: SecurityGroup;
    readonly egressSecurityGroup: SecurityGroup;

    constructor(scope: App, id: string, props: VpcStackProps) {
        super(scope, id, props);

        this.vpc = new Vpc(this, 'IsolatedVPC', {
            subnetConfiguration: [{
                name: 'isolatedSubnet',
                subnetType: SubnetType.PRIVATE_ISOLATED,
            }],
        });

        this.ingressSecurityGroup = new SecurityGroup(this, `ingress-security-group`, {
            vpc: this.vpc,
            allowAllOutbound: true,
        });
        this.ingressSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(5432));
        
        this.egressSecurityGroup = new SecurityGroup(this, 'egress-security-group', {
            vpc: this.vpc,
            allowAllOutbound: false,
        });
        this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));
    }
}