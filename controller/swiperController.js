const express = require('express');
const multer = require('multer');
const ObjectUtil = require('../util/ObjectUtil');
const config = require('../config/config');

const router = express.Router();
const swiperService = require('../services/swiperService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.swiperPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.swiperPath, storage });

// 分页获取轮播图数据
router.get('/all', (req, res) => {
	swiperService.getAllSwiper(req, res);
});

// 上传轮播图图片
router.post('/upload', upload.single('file'), (req, res) => {
	swiperService.uploadImg(req, res, filename);
});

// 新增轮播图
router.post('/add', (req, res) => {
	swiperService.addswiper(req, res);
});

// 删除轮播图
router.post('/deleteById', (req, res) => {
	swiperService.deleteById(req, res);
});

// 编辑轮播图
router.post('/edit', (req, res) => {
	swiperService.editSwiper(req, res);
});

module.exports = router;
