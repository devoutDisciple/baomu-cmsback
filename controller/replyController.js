const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const replyService = require('../service/replyService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.commentPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.commentPath, storage });

// 获取内容的评论
router.get('/allByContentId', (req, res) => {
	replyService.getAllByContentId(req, res);
});

// 评论帖子内容
router.post('/addContentReply', (req, res) => {
	replyService.addContentReply(req, res);
});

// 评论评论
router.post('/addReplyReply', (req, res) => {
	replyService.addReplyReply(req, res);
});

// 根据id获取评论详情
router.get('/replyDetailById', (req, res) => {
	replyService.getReplyDetailById(req, res);
});

// 获取评论的评论
router.get('/replyListByReplyId', (req, res) => {
	replyService.getReplyListByReplyId(req, res);
});

// 上传评论图片
router.post('/uploadImg', upload.single('file'), (req, res) => {
	replyService.uploadImg(req, res, filename);
});

module.exports = router;
