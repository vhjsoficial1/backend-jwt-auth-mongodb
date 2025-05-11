const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');

// Todas as rotas exigem autenticação
router.use(authController.protect);

router.route('/')
  .post(transactionController.createTransaction)
  .get(transactionController.getAllTransactions);

router.route('/stats')
  .get(transactionController.getTransactionStats);

router.route('/:id')
  .get(transactionController.getTransaction)
  .put(transactionController.updateTransaction)
  .patch(transactionController.partialUpdateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;