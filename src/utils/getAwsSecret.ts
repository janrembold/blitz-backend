import { SecretsManager } from 'aws-sdk';

const region = process.env.AWS_DEFAULT_REGION || 'eu-central-1';
const SecretsManagerInstance = new SecretsManager({ region });

interface DBSecret {
  username: string;
  password: string;
  host: string;
  port: number;
  dbname: string;
}

export const getAwsSecret = async (secretName = ''): Promise<DBSecret> => {
  const rawSecret = await SecretsManagerInstance.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(rawSecret.SecretString || '{}');
};
