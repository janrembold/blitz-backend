import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let now = 'notset';

    try {
        const secret = await getAwsSecret(process.env.SECRET_ARN);
        const credentials = JSON.parse(secret!);

        console.log('SecretManager', typeof credentials, credentials);

        const poolConfig = {
            user: credentials.username,
            password: credentials.password,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        };
        console.log('Pool Config', poolConfig);

        const pool = new Pool(poolConfig);
        const res = await pool.query('SELECT NOW()');
        await pool.end();

        console.log('SELECT NOW', res);
    } catch(err: any) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: `Buhhhh, CDK! You've hit "${err.message}"\n`
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello, CDK! You've hit "${event.path}" & "${now}"\n`
    };
}