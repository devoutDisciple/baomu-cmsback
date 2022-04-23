const express = require('express');

const router = express.Router();
const payService = require('../services/payService');

// 小程序支付,获取paysign
router.get('/list', (req, res) => {
	payService.getPayList(req, res);
});

module.exports = router;
