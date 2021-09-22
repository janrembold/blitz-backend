const express = require('express');
const { postgraphile } = require("postgraphile");

const app = express();

app.use(
    postgraphile(
        process.env.DATABASE_URL || "postgres://postgres:supersecret@localhost:5432/blitz",
        "public",
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            jwtSecret: 'supersecretjwttokenpass',
            jwtPgTypeIdentifier: 'public.jwt_token',
            pgDefaultRole: 'no_access_role'
        }
    )
);

app.listen(process.env.PORT || 3000);