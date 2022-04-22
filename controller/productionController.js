const express = require('express');

const router = express.Router();
const productionService = require('../services/productionService');

// 获取所有作品
router.get('/allProductions', (req, res) => {
	productionService.getAllProductions(req, res);
});

// 删除作品
router.get('/deleteProduction', (req, res) => {
	productionService.deleteProduction(req, res);
});

// -------------------------------

// 获取用户作品或者动态
router.get('/allByUserId', (req, res) => {
	productionService.getAllByUserId(req, res);
});

// 获取作品详情
router.get('/detailById', (req, res) => {
	productionService.getDetailById(req, res);
});

// 获取用户发布作品
router.get('/allProductionsByUserid', (req, res) => {
	productionService.getAllProductionsByUserId(req, res);
});

// 获取团队的一个动态和一个作品
router.get('/teamOneProductions', (req, res) => {
	productionService.getTeamOneProductions(req, res);
});

module.exports = router;
