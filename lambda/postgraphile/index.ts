import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let now = 'notset';

    try {
        const credentials = await getAwsSecret(process.env.SECRET_ARN);
        console.log('SecretManager', typeof credentials, credentials);

        const credeObj = JSON.parse(credentials!);       
        const poolConfig = {
            user: 'postgres',
            password: credeObj.password,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        };
        console.log('Pool Config', poolConfig);

        const pool = new Pool(poolConfig)
        
        const {rows} = await pool.query('SELECT NOW()');
        console.log('SELECT NOW', rows[0] || 'mist');
        
        // , (err: any, res: any) => {
        //     console.log(err, res)
        //     now = JSON.stringify(res.rows)
        //     pool.end()
        // })
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