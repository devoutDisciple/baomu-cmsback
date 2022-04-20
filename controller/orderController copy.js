const express = require('express');

const router = express.Router();
const orderService = require('../service/orderService');

// 根据用户id和课程id获取详情
router.get('/orderDetailByUserid', (req, res) => {
	orderService.getOrderDetailByUserid(req, res);
});

// 根据用户id获取所有报名课程
router.get('/allOrderByUserid', (req, res) => {
	orderService.getAllOrderByUserid(req, res);
});

// 根据用户id和type获取所有报名课程
router.get('/allOrderByUseridAndType', (req, res) => {
	orderService.getAllOrderByUseridAndType(req, res);
});

module.exports = router;
