const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const levelService = require('../service/levelService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.levelPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.levelPath, storage });

// 添加技能
router.post('/upload', upload.single('file'), (req, res) => {
	levelService.uploadFile(req, res, filename);
});

// 添加技能
router.post('/add', (req, res) => {
	levelService.addSkill(req, res);
});

// 删除技能
router.post('/delete', (req, res) => {
	levelService.deleteBySkillId(req, res);
});

// 删除技能
router.get('/all', (req, res) => {
	levelService.getAll(req, res);
});

module.exports = router;
