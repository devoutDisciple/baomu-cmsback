const express = require('express');

const router = express.Router();
const swiperService = require('../service/swiperService');

// 获取轮播图
router.get('/allSwiper', (req, res) => {
	swiperService.getAllSwiper(req, res);
});

module.exports = router;
