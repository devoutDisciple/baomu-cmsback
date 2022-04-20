const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const productionService = require('../service/productionService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.productionPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.productionPath, storage });

// 上传视图片
router.post('/uploadImg', upload.single('file'), (req, res) => {
	productionService.uploadImg(req, res, filename);
});

// 上传视频和图片
router.post('/uploadCoverImg', upload.single('file'), (req, res) => {
	productionService.uploadCoverImg(req, res, filename);
});

// 添加
router.post('/add', (req, res) => {
	productionService.add(req, res);
});

// 获取用户作品或者动态
router.get('/allByUserId', (req, res) => {
	productionService.getAllByUserId(req, res);
});

// 获取作品详情
router.get('/detailById', (req, res) => {
	productionService.getDetailById(req, res);
});

// 广场获取所有作品
router.get('/allProductions', (req, res) => {
	productionService.getAllProductions(req, res);
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
