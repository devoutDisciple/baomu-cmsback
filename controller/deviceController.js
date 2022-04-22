const express = require('express');

const router = express.Router();
const deviceService = require('../services/deviceService');

// 查看所有记录
router.get('/allByPage', (req, res) => {
	deviceService.getAllDevicesByPage(req, res);
});

// 删除
router.get('/deleteDeviceById', (req, res) => {
	deviceService.deleteDeviceById(req, res);
});

module.exports = router;
