const express = require('express');
const router = express.Router();
const {
  createPaymentSession,
  processPayment,
  getPaymentStatus,
  getUserTransactions,
  getPurchasedTickets,
  getTicketById,
} = require('../controllers/payment.controller');

router.post('/create', createPaymentSession);
router.post('/process', processPayment);
router.get('/:id/status', getPaymentStatus);
router.get('/user/:id/transactions', getUserTransactions);
router.get('/tickets/user/:id', getPurchasedTickets);
router.get('/tickets/:id', getTicketById);

module.exports = router;

