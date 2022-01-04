import { getAwsSecret } from './getAwsSecret';

export const getDbConnectionString = async (arn = ''): Promise<string> => {
  const { username, password, host, port, dbname } = await getAwsSecret(arn);
  return `postgres://${username}:${password}@${host}:${port}/${dbname}`;
};
