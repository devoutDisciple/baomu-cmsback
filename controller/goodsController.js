const express = require('express');

const router = express.Router();
const goodsService = require('../service/goodsService');

// 给帖子点赞
router.post('/addPostsGoods', (req, res) => {
	goodsService.addPostsGoods(req, res);
});

// 查看用户是否给帖子点过赞
router.get('/userProductionGoods', (req, res) => {
	goodsService.getUserProductionGoods(req, res);
});

// 给评论点赞
router.post('/addReplyGoods', (req, res) => {
	goodsService.addReplyGoods(req, res);
});

// 获取我赞了多少人
router.get('/goodsNumByUserId', (req, res) => {
	goodsService.getGoodsNumByUserId(req, res);
});

// 获取用户获得了多少赞
router.get('/goodsMyNumByUser', (req, res) => {
	goodsService.getMyGoodsNumByUser(req, res);
});

// 获取用户获得了多少评论
router.get('/commentsNumByUser', (req, res) => {
	goodsService.getCommentsNumByUser(req, res);
});

// 分页获取点赞详情
router.get('/goodsDetailByUser', (req, res) => {
	goodsService.getGoodsDetailByUser(req, res);
});

// 删除点赞
router.post('/deleteGoodsById', (req, res) => {
	goodsService.deleteGoodsById(req, res);
});

// 分页获取用户点赞的内容的详情
router.get('/commentsDetailByUser', (req, res) => {
	goodsService.getCommentsDetailByUser(req, res);
});

// 分页获取用户被点赞的内容详情
router.get('/commentsDetailByOther', (req, res) => {
	goodsService.getGoodsDetailByOther(req, res);
});

// 删除评论
router.post('/deleteCommentById', (req, res) => {
	goodsService.deleteCommentById(req, res);
});

module.exports = router;
