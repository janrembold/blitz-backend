import * as cdk from "@aws-cdk/core";
import { ISecret, Secret } from "@aws-cdk/aws-secretsmanager";

export interface Credentials {
  username: ISecret;
  password: ISecret;
}

export class CredentialsStack extends cdk.Stack {
  readonly credentials: { username: ISecret; password: ISecret };

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secretUsername = Secret.fromSecretCompleteArn(
      this,
      "BackendPersistenceUsername",
      // Pass your username secret ARN
      ""
    );

    const secretPassword = Secret.fromSecretCompleteArn(
      this,
      "BackendPersistencePassword",
      // Pass your password secret ARN
      ""
    );

    this.credentials = {
      username: secretUsername,
      password: secretPassword,
    };
  }
}