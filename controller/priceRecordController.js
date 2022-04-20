const express = require('express');

const router = express.Router();
const priceRecordService = require('../service/priceRecordService');

// 添加报价
router.post('/add', (req, res) => {
	priceRecordService.addPrice(req, res);
});

// 根据需求id获取报价记录
router.get('/priceRecordByDemandId', (req, res) => {
	priceRecordService.getPriceRecordByDemandId(req, res);
});

// 获取用户的报价详情
router.get('/priceRecordByUserId', (req, res) => {
	priceRecordService.getPriceRecordByUserId(req, res);
});

// 接受报价
router.post('/acceptPrice', (req, res) => {
	priceRecordService.acceptPrice(req, res);
});

// 拒绝报价
router.post('/refusePrice', (req, res) => {
	priceRecordService.refusePrice(req, res);
});

module.exports = router;
