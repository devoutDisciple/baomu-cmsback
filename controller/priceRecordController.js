const express = require('express');

const router = express.Router();
const priceRecordService = require('../services/priceRecordService');

// 根据需求id获取报价记录
router.get('/priceRecordByDemandId', (req, res) => {
	priceRecordService.getPriceRecordByDemandId(req, res);
});

module.exports = router;
