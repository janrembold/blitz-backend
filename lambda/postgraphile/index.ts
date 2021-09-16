import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    try {
        console.log(`Retrieve secret from "${process.env.SECRET_ARN}"`);
        const secret = await getAwsSecret(process.env.SECRET_ARN);
        const credentials = JSON.parse(secret!);

        const poolConfig = {
            user: credentials.username,
            password: credentials.password,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        };
        console.log('Pool Config', poolConfig);

        const pool = new Pool(poolConfig);
        console.log('Pool connected....maybe?! Trying SELECT...')

        const res = await pool.query('SELECT NOW()');
        await pool.end();
        console.log('SELECT NOW', res?.rows?.[0] || 'fooooo');

    } catch(err: any) {

        console.error('Error', err);

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: `Buhhhh, CDK! You've hit an error"\n`
        };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello, CDK! You've hit "${event.path}""\n`
    };
}