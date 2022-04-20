const express = require('express');

const router = express.Router();
const payService = require('../service/payService');

// 小程序支付,获取paysign
router.get('/paySign', (req, res) => {
	payService.getPaySign(req, res);
});

// 需求方支付，在议价确定之后，支付订单金额
router.post('/payByShoper', (req, res) => {
	payService.payByShoper(req, res);
});

// 处理微信支付返回接口
router.post('/handleWechatPay', (req, res) => {
	payService.handleWechatPay(req, res);
});

// 请求微信退款
router.post('/refunds', (req, res) => {
	payService.payRefunds(req, res);
});

// 处理微信支付返回接口
router.post('/handleWechatRefunds', (req, res) => {
	payService.handleWechatRefunds(req, res);
});

// 获取用户支付记录
router.get('/allPayByUserId', (req, res) => {
	payService.getAllPayByUserId(req, res);
});

module.exports = router;
