const express = require('express');

const router = express.Router();
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');
const subjectService = require('../services/subjectService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.subjectPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.subjectPath, storage });

router.get('/allSubjectByContions', (req, res) => {
	subjectService.getAllSubjectsByContions(req, res);
});

// 新增
router.post('/add', (req, res) => {
	subjectService.addSubject(req, res);
});

// 编辑
router.post('/edit', (req, res) => {
	subjectService.editSubject(req, res);
});

// 编辑tags
router.post('/addTags', (req, res) => {
	subjectService.addTags(req, res);
});

// 获取详情
router.get('/detailById', (req, res) => {
	subjectService.getDetailById(req, res);
});

// 删除
router.post('/deleteById', (req, res) => {
	subjectService.deleteById(req, res);
});

// 删除
router.post('/deleteById', (req, res) => {
	subjectService.deleteById(req, res);
});

// 上传图片
router.post('/upload', upload.single('file'), (req, res) => {
	subjectService.uploadFile(req, res, filename);
});

// 修改详情图片
router.post('/updateDetailImgs', (req, res) => {
	subjectService.updateDetailImgs(req, res);
});

module.exports = router;
