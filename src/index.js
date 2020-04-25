require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.get('/', (req, res) => {
  res.send('Success');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Biller system is listening on port ${port}`);
});
