const express = require('express');

const router = express.Router();
const dataService = require('../services/dataService');

// 获取统计数据
router.get('/total', (req, res) => {
	dataService.getTotal(req, res);
});

// 获取用户增长数据
router.get('/userNumData', (req, res) => {
	dataService.getUserNumData(req, res);
});

// 获取收入增长数据
router.get('/salesMoneyData', (req, res) => {
	dataService.getSalesData(req, res);
});

// 获取报名增长数据
router.get('/signupData', (req, res) => {
	dataService.getSignupData(req, res);
});

// 获取点赞增长数据
router.get('/teamData', (req, res) => {
	dataService.getTeamData(req, res);
});

module.exports = router;
