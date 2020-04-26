const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String },
    mobileNumber: { type: Number },
    bills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
      },
    ],
  },
  { collection: 'customers' },
);

module.exports = mongoose.model('Customer', customerSchema);
