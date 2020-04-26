const jwt = require('express-jwt');

const secretKey = process.env.JWT_SECRET_KEY || '';
const schemeID = process.env.JWT_SCHEME_ID || '';

const jwtAuth = jwt({ secret: secretKey, audience: schemeID });

module.exports = jwtAuth;
