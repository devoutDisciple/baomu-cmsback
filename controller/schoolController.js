const express = require('express');

const router = express.Router();
const schoolService = require('../services/schoolService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	schoolService.getAllByPage(req, res);
});

// 确定通过或者拒绝 sureState
router.post('/sureState', (req, res) => {
	schoolService.sureState(req, res);
});

module.exports = router;
