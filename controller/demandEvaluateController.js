const express = require('express');

const router = express.Router();
const demandEvaluateService = require('../service/demandEvaluateService');

// 增加评论
router.post('/addEvaluate', (req, res) => {
	demandEvaluateService.addEvaluate(req, res);
});

// 增加评论
router.get('/allEvaluatesByUserId', (req, res) => {
	demandEvaluateService.getAllEvaluatesByUserId(req, res);
});

// 查看评价详情
router.get('/evaluateDetail', (req, res) => {
	demandEvaluateService.getEvaluateDetailById(req, res);
});

module.exports = router;
