const apiResponse = require('../utils/apiResponse');
const customerModel = require('../models/customerModel');
const billModel = require('../models/billModel');

/**
 * Fetch bills by customer attribute
 */
exports.fetchBills = async (req, res) => {
  try {
    const { customerIdentifiers } = req.body || {};
    const { attributeName, attributeValue } = (customerIdentifiers && customerIdentifiers[0]) || {};

    const validAttributes = ['name', 'mobileNumber'];
    if (validAttributes.indexOf(attributeName) < 0) {
      return apiResponse.errorResponse(res, 400, { title: 'Bad Request', description: 'Invalid attribute name' });
    }

    const customerAndBills = await customerModel
      .findOne({ [attributeName]: attributeValue }, { _id: false, name: true })
      .populate({
        path: 'bills',
        select: '-_id customerAccount aggregates billerBillID generatedOn recurrence amountExactness',
      });

    if (!customerAndBills) {
      return apiResponse.dataNotFoundResponse(res, 'Customer');
    }

    const { name, bills } = customerAndBills;
    const billFetchStatus = bills && bills.length ? 'AVAILABLE' : 'NO_OUTSTANDING';
    return apiResponse.successResponse(res, 200, { customer: { name }, billFetchStatus, bills });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return apiResponse.serverErrorResponse(res);
  }
};

/**
 * Fetch bill receipt by bill ID
 */
exports.fetchBillReceipt = async (req, res) => {
  try {
    const { billerBillID, ...paymentDetails } = req.body || {};

    console.log("Fetch bill receipt started");
    const bill = await billModel.findOne({ billerBillID }, { _id: true, payment: true });
    console.log("Fetch bill receipt ended");

    if (!bill) {
      return apiResponse.dataNotFoundResponse(res, 'Bill');
    }

    if (bill.payment && bill.payment.platformBillID && Object.values(bill.payment).length) {
      return apiResponse.errorResponse(res, 400, {
        title: 'Bad Request',
        description: 'Payment already made for this bill',
      });
    }

    const billPayment = {
      ...paymentDetails,
      receipt: {
        receiptID: Math.random().toString(36).slice(2).toUpperCase(),
        receiptDate: new Date(),
      },
    };

    bill.payment = billPayment;
    await bill.save();

    return apiResponse.successResponse(res, 200, billPayment);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return apiResponse.serverErrorResponse(res);
  }
};

/**
 * Create customer and bills
 */
// const mongoose = require('mongoose');
// exports.createBills = async (req, res) => {
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
//     console.error(`Error: ${err.message}`);
//     return apiResponse.serverErrorResponse(res);
//   }
// };
