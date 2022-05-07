const express = require('express');

const router = express.Router();
const awardService = require('../services/awardService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	awardService.getAllByPage(req, res);
});

// 确定通过或者拒绝 sureState
router.post('/sureState', (req, res) => {
	awardService.sureState(req, res);
});

module.exports = router;
