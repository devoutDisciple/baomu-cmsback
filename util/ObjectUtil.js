const moment = require('moment');

module.exports = {
	copy: (obj) => {
		const newObj = {};
		Object.keys(obj).forEach((item) => {
			newObj[item] = obj[item];
		});
		return newObj;
	},
	getName() {
		let str = '';
		// eslint-disable-next-line prettier/prettier
		const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		for (let i = 1; i <= 16; i++) {
			const random = Math.floor(Math.random() * arr.length);
			str += arr[random];
		}
		return str;
	},
	isEmpty(obj) {
		return Object.keys(obj).length === 0;
	},
	deleteEmptyObject(obj) {
		Object.keys(obj).forEach((key) => {
			if (obj[key] === null || obj[key] === undefined) {
				delete obj[key];
			}
		});
		return obj;
	},
	countNumByTime(list) {
		if (!list || list.length === 0) return [];
		let now = moment(list[0].create_time).format('YYYY-MM-DD');
		const timeData = [{ num: 0, time: now }];
		let idx = 0;
		list.forEach((item) => {
			item.create_time = moment(item.create_time).format('YYYY-MM-DD');
			if (item.create_time === now) {
				timeData[idx].num++;
			} else {
				idx++;
				timeData[idx] = {
					num: 1,
					time: item.create_time,
				};
				now = item.create_time;
			}
		});
		return timeData;
	},
	countMoneyByTime(list) {
		if (!list || list.length === 0) return [];
		let now = moment(list[0].create_time).format('YYYY-MM-DD');
		const timeData = [{ money: 0, time: now }];
		let idx = 0;
		list.forEach((item) => {
			item.create_time = moment(item.create_time).format('YYYY-MM-DD');
			if (item.create_time === now) {
				timeData[idx].money = Number((Number(timeData[idx].money) + Number(item.money / 100)).toFixed(2));
			} else {
				idx++;
				timeData[idx] = {
					money: (item.money / 100).toFixed(2),
					time: item.create_time,
				};
				now = item.create_time;
			}
		});
		return timeData;
	},
};
