const express = require('express');

const router = express.Router();
const dataService = require('../services/dataService');

// 获取统计数据
router.get('/total', (req, res) => {
	dataService.getTotal(req, res);
});

// 获取用户增长数据
router.get('/userData', (req, res) => {
	dataService.getUserData(req, res);
});

// 获取团队增长数据
router.get('/teamData', (req, res) => {
	dataService.getTeamData(req, res);
});

// 获取收入增长数据
router.get('/moneyData', (req, res) => {
	dataService.getMoneyData(req, res);
});

// 获取作品增长数据
router.get('/productionData', (req, res) => {
	dataService.getProductionData(req, res);
});

module.exports = router;
