const express = require('express');

const router = express.Router();
const accountService = require('../services/accountService');

// 判断用户是否登录
router.get('/isLogin', (req, res) => {
	accountService.isLogin(req, res);
});

// 用户登录
router.post('/login', (req, res) => {
	accountService.login(req, res);
});

module.exports = router;
