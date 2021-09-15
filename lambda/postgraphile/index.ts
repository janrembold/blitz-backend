import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
        
    try {
        const DB_PASSWORD = await getAwsSecret(process.env.DB_HOST);
        console.log('SecretManager', DB_PASSWORD);

        const pool = new Pool({
            user: 'postgres',
            password: DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        })
        
        pool.query('SELECT NOW()', (err: any, res: any) => {
            console.log(err, res)
            pool.end()
        })
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
        body: `Hello, CDK! You've hit "${event.path}"\n`
    };
}