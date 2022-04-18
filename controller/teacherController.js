const express = require('express');

const multer = require('multer');

const router = express.Router();
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');
const teacherService = require('../services/teacherService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.photoPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.photoPath, storage });

// 获取所有老师
router.get('/allTeacher', (req, res) => {
	teacherService.getAllTeacher(req, res);
});

// 获取所有老师,不分页
router.get('/allTeachers', (req, res) => {
	teacherService.getAllTeachers(req, res);
});

// 删除老师
router.post('/deleteById', (req, res) => {
	teacherService.deleteById(req, res);
});

// 新增老师
router.post('/add', (req, res) => {
	teacherService.addTeacher(req, res);
});

// 上传图片
router.post('/upload', upload.single('file'), (req, res) => {
	teacherService.uploadFile(req, res, filename);
});

module.exports = router;
