import { Peer, Port, SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { App, Stack, StackProps } from '@aws-cdk/core';

export interface VpcStackProps extends StackProps {
  stage: string;
}

export class VpcStack extends Stack {
  readonly vpc: Vpc;
  readonly ingressSecurityGroup: SecurityGroup;
  // readonly egressSecurityGroup: SecurityGroup;

  constructor(scope: App, id: string, props: VpcStackProps) {
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

    this.vpc = new Vpc(this, `VPC-${props.stage}`, {
      maxAzs: 2,
    });

    this.ingressSecurityGroup = new SecurityGroup(this, `ingress-security-group-${props.stage}`, {
      vpc: this.vpc,
      allowAllOutbound: true,
    });
    // ToDo: maybe set this rule after creating ECS stack to set explicit IP?
    this.ingressSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(5432));

    // this.egressSecurityGroup = new SecurityGroup(this, 'egress-security-group', {
    //     vpc: this.vpc,
    //     allowAllOutbound: false,
    // });
    // this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));
    // this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(443));
  }
}
