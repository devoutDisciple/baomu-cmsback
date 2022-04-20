const express = require('express');

const router = express.Router();
const instrumentService = require('../service/instrumentService');

// 获取用户手机号
router.get('/allBySelect', (req, res) => {
	instrumentService.getAllBySelect(req, res);
});

module.exports = router;
