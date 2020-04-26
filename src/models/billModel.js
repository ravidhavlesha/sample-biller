const mongoose = require('mongoose');

const { Schema } = mongoose;

const billSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerAccount: { id: { type: Number } },
    billerBillID: { type: Number },
    generatedOn: { type: String },
    recurrence: { type: String },
    amountExactness: { type: String },
    aggregates: {
      total: {
        displayName: { type: String },
        amount: {
          value: { type: Number },
        },
      },
    },
    billStatus: { type: String, default: 'OUTSTANDING' },
    payment: {
      platformBillID: { type: String },
      paymentDetails: {
        platformTransactionRefID: { type: String },
        uniquePaymentRefID: { type: String },
        amountPaid: {
          value: { type: Number },
        },
        billAmount: {
          value: { type: Number },
        },
      },
      receipt: {
        id: { type: String },
        date: { type: Date },
      },
    },
  },
  { collection: 'bills' }
);

module.exports = mongoose.model('Bill', billSchema);
