const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const billsController = require('../controllers/billsController');

router.post('/fetch', authMiddleware, billsController.fetchBills);
router.post('/fetchReceipt', authMiddleware, billsController.fetchBillReceipt);
// router.post('/create', authMiddleware, billsController.createBills);

module.exports = router;
