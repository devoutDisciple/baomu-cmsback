const express = require('express');

const router = express.Router();
const orderService = require('../services/orderService');

// 分页获取数据
router.get('/allByConditions', (req, res) => {
	orderService.getAllOrderByConditions(req, res);
});

module.exports = router;
