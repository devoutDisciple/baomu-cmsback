const express = require('express');

const router = express.Router();
const idcardService = require('../services/idcardService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	idcardService.getAllByPage(req, res);
});

module.exports = router;
