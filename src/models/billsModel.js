const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let billSchema = new Schema({
  billerBillID: { type: Number },
  generatedOn: { type: Date },
  recurrence: { type: String },
  amountExactness: { type: String },
  customerAccount: {
    id: { type: Number },
  },
  aggregates: {
    total: {
      displayName: { type: String },
      amount: {
        value: { type: Number },
      },
    },
  },
});

let billsSchema = new Schema(
  {
    customer: {
      name: { type: String },
      mobileNumber: { type: Number },
    },
    bills: [billSchema],
  },
  { collection: 'bills' }
);

module.exports = mongoose.model('Bills', billsSchema);
