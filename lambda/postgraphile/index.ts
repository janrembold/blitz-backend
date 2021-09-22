import { Pool } from 'pg';
import { getAwsSecret } from './secretsManager';
import fetch from 'node-fetch';

const checkOnlineStatus = async () => {
    try {
      const online = await fetch("https://janrembold.github.io/img/icons/github.png");
      return online.status >= 200 && online.status < 300; // either true or false
    } catch (err) {
      return false; // definitely offline
    }
  };

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    const { path } = event;
    let body = `Hello, CDK! You've hit "${path}""\n`;

    if(path === '/fetch') {
        const isOnline = await checkOnlineStatus();
        body += `- Lambda is ${isOnline ? 'online' : 'offline'}\n`;
    }

    if(path === '/secret') {
        try {
            body += `- Call SecretsManager with ${process.env.SECRET_ARN}\n`;
            const secret = await getAwsSecret(process.env.SECRET_ARN);

            const credentials = JSON.parse(secret!);
            body += `- Secret received for "${credentials.username}"\n`;
            body += `- DB_PASS = "${credentials.password.slice(0,5)}..."\n`;
            body += `- DB_HOST = "${credentials.host}..."\n`;
        } catch(err: any) {
            body += `- Error occured "${err.message}"\n`;
        }
    }

    if(path === '/env') {
        body += `- ENV = "${JSON.stringify(process.env)}"\n`;
    }

    if(path === '/env') {
        body += `- DB_HOST = "${process.env.DB_HOST}"\n`;
        body += `- DB_NAME = "${process.env.DB_NAME}"\n`;
        body += `- DB_PORT = "${process.env.DB_PORT}"\n`;
    }

    if(path === '/db') {
        try {
            const secret = await getAwsSecret(process.env.SECRET_ARN);
            const credentials = JSON.parse(secret!);

            const pool = new Pool({
                user: credentials.username,
                password: credentials.password,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT || '5432', 10),
            });
            body += 'Pool connected....maybe?! Trying SELECT...\n';

            if(pool) {
                await pool.end();
                body += `- Pool closed\n`;
            } else {
                body += `- Pool was not defined\n`;
            }
        } catch(err: any) {
            body += `- Error occured "${err.message}"\n`;
        }
    }

    if(path === '/query') {
        try {
            const secret = await getAwsSecret(process.env.SECRET_ARN);
            const credentials = JSON.parse(secret!);

            const pool = new Pool({
                user: credentials.username,
                password: credentials.password,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT || '5432', 10),
            });
            body += 'Pool connected....maybe?! Trying SELECT...\n';

            if(pool) {
                const res = await pool.query('SELECT NOW()');
                body += `- SELECT NOW() = "${res?.rows?.[0] || 'fooooo'}"\n`;

                await pool.end();
            } else {
                body += `- Pool was not defined\n`;
            }
        } catch(err: any) {
            body += `- Error occured "${err.message}"\n`;
        }
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body
    };
}