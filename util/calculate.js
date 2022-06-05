const Decimal = require('decimal.js');

module.exports = {
	// 加
	sum: (...rest) => {
		const mm = Array.from(rest);
		let res = 0;
		mm.forEach((item) => {
			res = Decimal.sum(res, item).toNumber();
		});
		return res;
	},
	// 减
	sub: (a, ...rest) => {
		const mm = Array.from(rest);
		let res = a;
		mm.forEach((item) => {
			res = Decimal.sub(res, item).toNumber();
		});
		return res;
	},
	// 乘
	mul: (a, ...rest) => {
		const mm = Array.from(rest);
		let res = a;
		mm.forEach((item) => {
			res = Decimal.mul(res, item).toNumber();
		});
		return res;
	},
	// 除
	div: (a, b) => {
		return Decimal.div(a, b).toNumber();
	},
};
