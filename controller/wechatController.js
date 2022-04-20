const express = require('express');

const router = express.Router();
const wechatService = require('../service/wechatService');

// 获取用户手机号
router.post('/phone', (req, res) => {
	wechatService.getPhone(req, res);
});

module.exports = router;
