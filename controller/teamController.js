const express = require('express');

const router = express.Router();
const teamService = require('../services/teamService');

// 获取所有团队
router.get('/allTeams', (req, res) => {
	teamService.getAllTeams(req, res);
});

// 根据teamid获取成员列表
router.get('/teamsUsersByTeamId', (req, res) => {
	teamService.getTeamsUsersByTeamId(req, res);
});

// 解散乐队
router.post('/cancelTeam', (req, res) => {
	teamService.cancelTeam(req, res);
});

// -------------

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

// 更新乐队成员是否接受邀请
router.post('/decisionInvitation', (req, res) => {
	teamService.decisionInvitation(req, res);
});

// 根据团队id和个人id获取个人在乐队信息
router.get('/teamUserDetail', (req, res) => {
	teamService.teamUserDetail(req, res);
});

module.exports = router;
