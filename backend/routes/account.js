const express = require('express');
const mongoose = require('mongoose');
const { authMiddleWare } = require('./middleware');
const { Account } = require('../db');
const router = express.Router();

router.get('/balance', authMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const account = await Account.findOne({ userId: userId });
    res.json({ balance: account.balance });
  } catch (error) {
    console.error('Error getting balance', error);
    res.status(500).json({ message: 'error getting balance!' });
  }
});

router.post('/transfer', authMiddleWare, async (req, res) => {
  const session = await mongoose.startSession();
  const userId = req.userId;
  const { to, amount } = req.body;
  try {
    session.startTransaction();
    const myAccount = await Account.findOne({ userId }).session(session);

    if (myAccount.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({
        message: 'Insufficient balance',
      });
      return;
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Invalid account',
      });
    }

    await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(
      session
    );
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({
      message: 'Transfer successful',
    });
  } catch (error) {
    console.error('Error in Transfer', error);
    await session.abortTransaction();
    res.status(500).json({ message: 'error Transfer!' });
  }
});

module.exports = router;
