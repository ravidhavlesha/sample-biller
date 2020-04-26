const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
const dbConnection = mongoose
  .connect(process.env.MONGO_URI || '', dbConfig)
  .then((conn) => {
    console.log('Successfully connected to mongo');
    return conn;
  })
  .catch((err) => {
    console.error(`Error while attempting to connect to mongo with message: ${err.message}`);
  });

module.exports = dbConnection;
