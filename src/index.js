require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const billsRoute = require('./routes/billsRoute');

const app = express();

app.use(helmet());

app.use('/bills', billsRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Biller system is listening on port ${port}`);
});
