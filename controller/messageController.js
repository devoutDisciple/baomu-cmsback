const express = require('express');

const router = express.Router();
const messageService = require('../service/messageService');

// 增加信息
router.post('/addMsg', (req, res) => {
	messageService.addMsg(req, res);
});

// 获取信息
router.get('/msgsByUserId', (req, res) => {
	messageService.msgsByUserId(req, res);
});

module.exports = router;
