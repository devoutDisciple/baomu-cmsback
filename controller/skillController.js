const express = require('express');

const router = express.Router();
const skillService = require('../services/skillService');

// 删除技能
router.post('/delete', (req, res) => {
	skillService.deleteBySkillId(req, res);
});

// 获取所有技能技能
router.get('/all', (req, res) => {
	skillService.getAll(req, res);
});

// 确定通过或者拒绝 sureState
router.post('/sureState', (req, res) => {
	skillService.sureState(req, res);
});

module.exports = router;
