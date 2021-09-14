import { Pool, Client } from 'pg';

export const express = async (event: any) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const pool = new Pool({
      user: 'dbuser',
      host: 'database.server.com',
      database: 'mydb',
      password: 'secretpassword',
      port: 3211,
    })

    pool.query('SELECT NOW()', (err: any, res: any) => {
      console.log(err, res)
      pool.end()
    })

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hellooooo, CDK! You've hit "${event.path}"\n`
    };
}