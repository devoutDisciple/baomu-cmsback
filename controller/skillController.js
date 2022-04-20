const express = require('express');

const router = express.Router();
const skillService = require('../service/skillService');

// 添加技能
router.post('/add', (req, res) => {
	skillService.addSkill(req, res);
});

// 删除技能
router.post('/delete', (req, res) => {
	skillService.deleteBySkillId(req, res);
});

// 获取所有技能技能
router.get('/all', (req, res) => {
	skillService.getAll(req, res);
});

module.exports = router;
