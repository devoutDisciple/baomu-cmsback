const teamState = [
	{ id: 1, name: '未开始' },
	{ id: 2, name: '进行中' },
	{ id: 3, name: '拼团成功' },
	{ id: 4, name: '拼团超时失败' },
	{ id: 5, name: '拼团人数不够失败' },
	{ id: 6, name: '拼团失败已退款' },
];

const filterTeamState = (id) => {
	const selectList = teamState.filter((item) => Number(item.id) === Number(id));
	if (selectList && selectList.length !== 0) {
		return selectList[0].name;
	}
	return '';
};

module.exports = {
	teamState,
	filterTeamState,
};
