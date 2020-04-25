const router = require('express').Router();

const billsController = require('../controllers/billsController');

router.post('/fetch', billsController.fetchBills);
router.post('/fetchReceipt', billsController.fetchBillReceipt);

module.exports = router;
