import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const { path } = event;
    let body = `Hello, CDK! You've hit "${path}""\n`;

    if(path === '/secret') {
        try {
            body += `- Call SecretsManager with ${process.env.SECRET_ARN}\n`;
            const secret = await getAwsSecret(process.env.SECRET_ARN);

            const credentials = JSON.parse(secret!);
            body += `- Secret received for "${credentials.username}"\n`;
        } catch(err: any) {
            body += `- Error occured "${err.message}"\n`;
        }
    }

    if(path === '/db') {
        try {
            const secret = await getAwsSecret(process.env.SECRET_ARN);
            const credentials = JSON.parse(secret!);

            body += `- DB_USER = "${credentials.username}"\n`;
            body += `- DB_PASS = "${credentials.password.slice(0,5)}..."\n`;
            body += `- DB_HOST = "${process.env.DB_HOST}"\n`;
            body += `- DB_NAME = "${process.env.DB_NAME}"\n`;
            body += `- DB_PORT = "${process.env.DB_PORT}"\n`;

            const pool = new Pool({
                user: credentials.username,
                password: credentials.password,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT || '5432', 10),
            });
            body += 'Pool connected....maybe?! Trying SELECT...\n';

            const res = await pool.query('SELECT NOW()');
            await pool.end();
            body += `- SELECT NOW() = "${res?.rows?.[0] || 'fooooo'}"\n`;
        } catch(err: any) {
            body += `- Error occured "${err.message}"\n`;
        }
    }

    // try {
    //     console.log(`Retrieve secret from "${process.env.SECRET_ARN}"`);
    //     const secret = await getAwsSecret(process.env.SECRET_ARN);
    //     const credentials = JSON.parse(secret!);
    //     console.log('Secret received', credentials);

    //     const poolConfig = {
    //         user: credentials.username,
    //         password: credentials.password,
    //         host: process.env.DB_HOST,
    //         database: process.env.DB_NAME,
    //         port: parseInt(process.env.DB_PORT || '5432', 10),
    //     };
    //     console.log('Pool Config', poolConfig);

    //     const pool = new Pool(poolConfig);
    //     console.log('Pool connected....maybe?! Trying SELECT...')

    //     const res = await pool.query('SELECT NOW()');
    //     await pool.end();
    //     console.log('SELECT NOW', res?.rows?.[0] || 'fooooo');
        
    // } catch(err: any) {

    //     console.error('Error', err);

    //     return {
    //         statusCode: 200,
    //         headers: { "Content-Type": "text/plain" },
    //         body: `Buhhhh, CDK! You've hit an error"\n`
    //     };
    // }

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body
    };
}