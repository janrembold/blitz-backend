import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
// import * as ec2 from '@aws-cdk/aws-ec2';
// import * as rds from '@aws-cdk/aws-rds';
// import * as secretsmanager from '@aws-cdk/aws-secretsmanager';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const secret = secretsmanager.Secret.fromSecretAttributes(this, 'SamplePassword', {
    //   secretArn: 'arn:aws:secretsmanager:{region}:{organisation-id}:secret:ImportedSecret-sample',
    // });

    // const vpc = new ec2.Vpc(this, 'VPC');

    // new rds.DatabaseInstance(this, 'Instance', {
    //   engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13_3 }),
    //   // optional, defaults to m5.large
    //   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    //   credentials: rds.Credentials.fromGeneratedSecret('syscdk'), // Optional - will default to 'admin' username and generated password
    //   vpc,
    //   vpcSubnets: {
    //     subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    //   }
    // });

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,    
      code: lambda.Code.fromAsset('lambda'),  
      handler: 'hello.handler'                
    });

    new apigw.LambdaRestApi(this, 'HelloWorldEndpoint', {
      handler: hello
    });
  }
}
