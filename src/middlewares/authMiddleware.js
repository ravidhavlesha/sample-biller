const jwt = require('express-jwt');

const secretKey = process.env.JWT_SECRET_KEY || '';

const jwtAuth = jwt({ secret: secretKey });

module.exports = jwtAuth;
