const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const videoService = require('../service/videoService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.productionPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		const originalname = file.originalname;
		const orginExt = originalname && originalname.lastIndexOf('.') > 0 ? originalname.substring(originalname.lastIndexOf('.')) : '.mp4';
		filename = `${ObjectUtil.getName()}-${Date.now()}${orginExt}`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.productionPath, storage });

// 上传视视频
router.post('/upload', upload.single('file'), (req, res) => {
	videoService.upload(req, res, filename);
});

module.exports = router;
