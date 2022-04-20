const express = require('express');

const router = express.Router();
const userService = require('../services/userService');

// 分页获取用户数据
router.get('/usersByPage', (req, res) => {
	userService.getUsersByPage(req, res);
});

// 获取用户详情
router.get('/userDetail', (req, res) => {
	userService.getUserDetail(req, res);
});

module.exports = router;
