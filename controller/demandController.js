const express = require('express');

const router = express.Router();
const demandService = require('../services/demandService');

// 根据输入框查询需求
router.get('/allDemands', (req, res) => {
	demandService.getAllDemands(req, res);
});

// 获取需求详情
router.get('/detailById', (req, res) => {
	demandService.getDetailById(req, res);
});

// 删除需求
router.post('/deleteDemand', (req, res) => {
	demandService.deleteDemand(req, res);
});

module.exports = router;
