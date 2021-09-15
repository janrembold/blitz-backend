import { SecretsManager } from "aws-sdk";

const region = process.env.AWS_DEFAULT_REGION || 'eu-central-1';
const SecretsManagerInstance = new SecretsManager({ region });

export const getAwsSecret = async (secretName: string = ''): Promise<any> => {
  const rawSecret = await SecretsManagerInstance.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(rawSecret.SecretString || '');
};

