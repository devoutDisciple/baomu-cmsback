const express = require('express');

const router = express.Router();
const idcardService = require('../services/idcardService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	idcardService.getAllByPage(req, res);
});

// 确定通过或者拒绝 sureState
router.post('/sureState', (req, res) => {
	idcardService.sureState(req, res);
});

// 删除
router.post('/deleteItemById', (req, res) => {
	idcardService.deleteItemById(req, res);
});

module.exports = router;
