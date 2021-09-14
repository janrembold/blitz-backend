import { ISecret, Secret } from "@aws-cdk/aws-secretsmanager";
import * as cdk from "@aws-cdk/core";

export interface DBCredentials {
  username: ISecret;
  password: ISecret;
}

export class DbCredentialsStack extends cdk.Stack {
  readonly dbCredentials: { username: ISecret; password: ISecret };

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const secretUsername = Secret.fromSecretCompleteArn(
      this,
      "BackendPersistenceUsername",
      // replace the ARN with your actual one for your username secret
      `arn:aws:secretsmanager:${this.region}:${this.account}:secret:prod/backend/rds/username-<UNIQUE_ID>`
    );

    const secretPassword = Secret.fromSecretCompleteArn(
      this,
      "BackendPersistencePassword",
       // replace the ARN with your actual one for your password secret
      `arn:aws:secretsmanager:${this.region}:${this.account}:secret:prod/backend/rds/password-<UNIQUE_ID>`
    );
    
    this.dbCredentials = {
      username: secretUsername,
      password: secretPassword,
    };
  }
}