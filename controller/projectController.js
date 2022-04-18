const express = require('express');

const router = express.Router();
const projectService = require('../services/projectService');

// 获取所有班级，根据类别id
router.get('/allProjectByTypeId', (req, res) => {
	projectService.getAllProjectByTypeId(req, res);
});

// 新增
router.post('/add', (req, res) => {
	projectService.addProject(req, res);
});

// 删除
router.post('/deleteById', (req, res) => {
	projectService.deleteById(req, res);
});

// 根据type allPorjectByType
router.get('/allPorjectByType', (req, res) => {
	projectService.getAllPorjectByType(req, res);
});

module.exports = router;
