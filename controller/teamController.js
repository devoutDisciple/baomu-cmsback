const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const teamService = require('../service/teamService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.teamPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.teamPath, storage });

// 上传图片
router.post('/upload', upload.single('file'), (req, res) => {
	teamService.uploadFile(req, res, filename);
});

// 创建团队
router.post('/add', (req, res) => {
	teamService.add(req, res);
});

// 获取团队列表根据用户id
router.get('/teamsByUserId', (req, res) => {
	teamService.getTeamsByUserId(req, res);
});

// 根据teamid获取成员列表
router.get('/teamsUsersByTeamId', (req, res) => {
	teamService.getTeamsUsersByTeamId(req, res);
});

// 根据team_user_id删除成员
router.post('/deleteTeamUser', (req, res) => {
	teamService.deleteTeamUser(req, res);
});

// 根据team_user_id获取状态
router.get('/userDetailByTeamUserId', (req, res) => {
	teamService.getUserDetailByTeamUserId(req, res);
});

// 根据team_user_id修改乐队担当
router.post('/updateUserDetailByTeamUserId', (req, res) => {
	teamService.updateUserDetailByTeamUserId(req, res);
});

// 根据team_id查询team详情
router.get('/detailByTeamId', (req, res) => {
	teamService.getDetailByTeamId(req, res);
});

// 添加乐队成员 addNewTeamUser
router.post('/addNewTeamUser', (req, res) => {
	teamService.addNewTeamUser(req, res);
});

// 编辑乐队信息
router.post('/updateTeamDetail', (req, res) => {
	teamService.updateTeamDetail(req, res);
});

// 解散乐队
router.post('/cancelTeam', (req, res) => {
	teamService.cancelTeam(req, res);
});

// 更新乐队成员是否接受邀请
router.post('/decisionInvitation', (req, res) => {
	teamService.decisionInvitation(req, res);
});

// 根据团队id和个人id获取个人在乐队信息
router.get('/teamUserDetail', (req, res) => {
	teamService.teamUserDetail(req, res);
});

module.exports = router;
