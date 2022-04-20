const express = require('express');

const router = express.Router();
const subjectService = require('../service/subjectService');

// 获取所有课程，根据班级id
router.get('/allSubjectByProjectId', (req, res) => {
	subjectService.getAllSubjectByProjectId(req, res);
});

// 获取课程详情，根据id
router.get('/subjectDetailById', (req, res) => {
	subjectService.getSubjectDetailById(req, res);
});

// 根据关键词搜索
router.get('/allSubjectByKeywords', (req, res) => {
	subjectService.getAllSubjectByKeywords(req, res);
});

module.exports = router;
