"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
class VpcStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.vpc = new aws_ec2_1.Vpc(this, 'IsolatedVPC', {
            // cidr: '10.0.0.0/16',
            // maxAzs: 2,
            subnetConfiguration: [{
                    // cidrMask: 26,
                    name: 'isolatedSubnet',
                    subnetType: aws_ec2_1.SubnetType.PRIVATE_ISOLATED,
                }],
            natGateways: 0
        });
        // this.ingressSecurityGroup = new SecurityGroup(this, 'ingress-security-group', {
        //     vpc: this.vpc,
        //     allowAllOutbound: false,
        //     securityGroupName: 'IngressSecurityGroup',
        // });
        // this.ingressSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(3306));
        // this.egressSecurityGroup = new SecurityGroup(this, 'egress-security-group', {
        //     vpc: this.vpc,
        //     allowAllOutbound: false,
        //     securityGroupName: 'EgressSecurityGroup',
        // });
        // this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));
    }
}
exports.VpcStack = VpcStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFxRDtBQUNyRCw4Q0FBMkU7QUFFM0UsTUFBYSxRQUFTLFNBQVEsWUFBSztJQUsvQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDbEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3BDLHVCQUF1QjtZQUN2QixhQUFhO1lBQ2IsbUJBQW1CLEVBQUUsQ0FBQztvQkFDbEIsZ0JBQWdCO29CQUNoQixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxnQkFBZ0I7aUJBQzFDLENBQUM7WUFDRixXQUFXLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7UUFFSCxrRkFBa0Y7UUFDbEYscUJBQXFCO1FBQ3JCLCtCQUErQjtRQUMvQixpREFBaUQ7UUFDakQsTUFBTTtRQUNOLHNGQUFzRjtRQUV0RixnRkFBZ0Y7UUFDaEYscUJBQXFCO1FBQ3JCLCtCQUErQjtRQUMvQixnREFBZ0Q7UUFDaEQsTUFBTTtRQUNOLHdFQUF3RTtJQUM1RSxDQUFDO0NBQ0o7QUFqQ0QsNEJBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBcHAsIFN0YWNrLCBTdGFja1Byb3BzfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7UGVlciwgUG9ydCwgU2VjdXJpdHlHcm91cCwgU3VibmV0VHlwZSwgVnBjfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJ1xuXG5leHBvcnQgY2xhc3MgVnBjU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gICAgcmVhZG9ubHkgdnBjOiBWcGM7XG4gICAgcmVhZG9ubHkgaW5ncmVzc1NlY3VyaXR5R3JvdXA6IFNlY3VyaXR5R3JvdXA7XG4gICAgcmVhZG9ubHkgZWdyZXNzU2VjdXJpdHlHcm91cDogU2VjdXJpdHlHcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICB0aGlzLnZwYyA9IG5ldyBWcGModGhpcywgJ0lzb2xhdGVkVlBDJywge1xuICAgICAgICAgICAgLy8gY2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICAgICAgICAgIC8vIG1heEF6czogMixcbiAgICAgICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7XG4gICAgICAgICAgICAgICAgLy8gY2lkck1hc2s6IDI2LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdpc29sYXRlZFN1Ym5ldCcsXG4gICAgICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBuYXRHYXRld2F5czogMFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLmluZ3Jlc3NTZWN1cml0eUdyb3VwID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgJ2luZ3Jlc3Mtc2VjdXJpdHktZ3JvdXAnLCB7XG4gICAgICAgIC8vICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgICAvLyAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgICAgIC8vICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0luZ3Jlc3NTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIHRoaXMuaW5ncmVzc1NlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoUGVlci5pcHY0KCcxMC4wLjAuMC8xNicpLCBQb3J0LnRjcCgzMzA2KSk7XG4gICAgICAgIFxuICAgICAgICAvLyB0aGlzLmVncmVzc1NlY3VyaXR5R3JvdXAgPSBuZXcgU2VjdXJpdHlHcm91cCh0aGlzLCAnZWdyZXNzLXNlY3VyaXR5LWdyb3VwJywge1xuICAgICAgICAvLyAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgICAgLy8gICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgICAgICAvLyAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdFZ3Jlc3NTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIHRoaXMuZWdyZXNzU2VjdXJpdHlHcm91cC5hZGRFZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4MCkpO1xuICAgIH1cbn0iXX0=