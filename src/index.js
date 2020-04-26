require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

require('./utils/dbConnection');
const apiResponse = require('./utils/apiResponse');

const billsRoute = require('./routes/billsRoute');

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/bills', billsRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Biller system is listening on port ${port}`);
});

app.all('*', (req, res) => {
  return apiResponse.errorResponse(res, 404, { title: 'Page not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log('Error: Authentication failed');
    return apiResponse.errorResponse(res, 401, { title: 'Authentication failed' });
  }

  console.log(`Error: ${err.message || ''}`);
  return apiResponse.serverErrorResponse(res);
});
