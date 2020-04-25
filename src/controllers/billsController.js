const apiResponse = require('../utils/apiResponse');
const billsModel = require('../models/billsModel');

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

    const bill = await billsModel.findOne(
      { [`customer.${attributeName}`]: attributeValue },
      {
        _id: false,
        'customer.name': true,
        'bills.customerAccount': true,
        'bills.aggregates': true,
        'bills.billerBillID': true,
        'bills.generatedOn': true,
        'bills.recurrence': true,
        'bills.amountExactness': true,
      }
    );

    if (!bill) {
      return apiResponse.errorResponse(res, 404, {
        code: 'customer-not-found',
        title: 'Customer not found',
        traceID: '',
        description: 'The requested customer was not found in the biller system.',
        param: '',
        docURL: '',
      });
    } else {
      const { customer, bills } = bill;
      const billFetchStatus = bill.bills && bill.bills.length ? 'AVAILABLE' : 'NO_OUTSTANDING';

      return apiResponse.successResponse(res, 200, { customer, billFetchStatus, bills });
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return apiResponse.serverErrorResponse(res);
  }
};

/**
 * Fetch bill receipt by bill ID
 */
exports.fetchBillReceipt = (req, res) => {
  res.send('Fetch bill receipt route');
};
