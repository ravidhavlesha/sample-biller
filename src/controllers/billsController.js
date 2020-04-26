const Joi = require('joi');
const apiResponse = require('../utils/apiResponse');
const customerModel = require('../models/customerModel');
const billModel = require('../models/billModel');

/**
 * Fetch bills by customer attribute
 */
exports.fetchBills = async (req, res, next) => {
  try {
    const validationSchema = Joi.object()
      .keys({
        customerIdentifiers: Joi.array()
          .items(
            Joi.object()
              .keys({
                attributeName: Joi.string().valid(['name', 'mobileNumber']),
                attributeValue: Joi.number().required(),
              })
              .required()
          )
          .required(),
      })
      .required();

    const { error } = Joi.validate(req.body, validationSchema);
    if (error) {
      return apiResponse.badRequestResponse(res);
    }

    const { customerIdentifiers } = req.body || {};
    const { attributeName, attributeValue } = (customerIdentifiers && customerIdentifiers[0]) || {};

    const customerAndBills = await customerModel
      .findOne({ [attributeName]: attributeValue }, { _id: false, name: true })
      .populate({
        path: 'bills',
        match: { billStatus: 'OUTSTANDING' },
        select: '-_id customerAccount aggregates billerBillID generatedOn recurrence amountExactness',
      });

    if (!customerAndBills) {
      return apiResponse.dataNotFoundResponse(res, 'Customer');
    }

    const { name, bills } = customerAndBills;
    const billFetchStatus = bills && bills.length ? 'AVAILABLE' : 'NO_OUTSTANDING';
    return apiResponse.successResponse(res, 200, { customer: { name }, billDetails: { billFetchStatus, bills } });
  } catch (err) {
    return next(err);
  }
};

/**
 * Fetch bill receipt by bill ID
 */
exports.fetchBillReceipt = async (req, res, next) => {
  try {
    const validationSchema = Joi.object().keys({
      billerBillID: Joi.number().required(),
      platformBillID: Joi.number().required(),
      paymentDetails: Joi.object()
        .keys({
          platformTransactionRefID: Joi.number().required(),
          uniquePaymentRefID: Joi.number().required(),
          amountPaid: Joi.object()
            .keys({
              value: Joi.number().required(),
            })
            .required(),
          billAmount: Joi.object()
            .keys({
              value: Joi.number().required(),
            })
            .required(),
        })
        .required(),
    });

    const { error } = Joi.validate(req.body, validationSchema);
    if (error) {
      return apiResponse.badRequestResponse(res);
    }

    const { billerBillID, platformBillID, paymentDetails } = req.body || {};
    const { platformTransactionRefID } = paymentDetails;

    const bill = await billModel.findOne({ billerBillID }, { _id: true, billStatus: true });

    if (!bill) {
      return apiResponse.dataNotFoundResponse(res, 'Bill');
    }

    // We can also add this outstanding check in query but added here for specific message.
    if (bill.billStatus && bill.billStatus !== 'OUTSTANDING') {
      return apiResponse.badRequestResponse(res, 'The requested bill was already paid in the biller system.');
    }

    // We don't want MS.
    let receiptDate = new Date();
    receiptDate.setMilliseconds(0);
    receiptDate = receiptDate.toISOString().replace('.000', '');

    const billPayment = {
      platformBillID,
      paymentDetails,
      receipt: {
        id: Math.random().toString(36).slice(2).toUpperCase(),
        date: receiptDate,
      },
    };

    bill.billStatus = 'PAID';
    bill.payment = billPayment;
    await bill.save();

    const billPaymentResponse = {
      billerBillID,
      platformBillID,
      platformTransactionRefID,
      receipt: billPayment.receipt,
    };
    return apiResponse.successResponse(res, 200, billPaymentResponse);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create customer and bills
 */
// const mongoose = require('mongoose');
// exports.createBills = async (req, res, next) => {
//   try {
//     const customer = new customerModel({
//       _id: new mongoose.Types.ObjectId(),
//       name: 'Ravi Dhavlesha',
//       mobileNumber: '9000000001',
//     });

//     customer.save(async () => {
//       const bill1 = await new billModel({
//         aggregates: { total: { amount: { value: 99000 }, displayName: 'Total Outstanding' } },
//         billerBillID: 10000001,
//         generatedOn: '2019-08-01T08:28:12Z',
//         recurrence: 'ONE_TIME',
//         amountExactness: 'EXACT',
//         customerAccount: { id: 8208021440 },
//         customer: customer._id,
//       }).save();

//       customer.bills.push(bill1);

//       const bill2 = await new billModel({
//         aggregates: { total: { amount: { value: 88000 }, displayName: 'Total Outstanding' } },
//         billerBillID: 10000002,
//         generatedOn: '2019-08-02T08:28:12Z',
//         recurrence: 'ONE_TIME',
//         amountExactness: 'EXACT',
//         customerAccount: { id: 8208021440 },
//         customer: customer._id,
//       }).save();

//       customer.bills.push(bill2);

//       customer.save();
//     });

//     return res.send('Done');
//   } catch (err) {
//     next(err);
//   }
// };
