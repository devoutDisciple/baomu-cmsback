const express = require('express');

const router = express.Router();
const projectService = require('../service/projectService');

// 获取所有班级，根据类别id
router.get('/allProjectByTypeId', (req, res) => {
	projectService.getAllProjectByTypeId(req, res);
});

module.exports = router;
