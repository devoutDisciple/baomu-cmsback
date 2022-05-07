const express = require('express');

const router = express.Router();
const levelService = require('../services/levelService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	levelService.getAllByPage(req, res);
});

// 确定通过或者拒绝 sureState
router.post('/sureState', (req, res) => {
	levelService.sureState(req, res);
});

// 删除
router.post('/deleteItemById', (req, res) => {
	levelService.deleteItemById(req, res);
});

module.exports = router;
