module.exports = {
	// 200 成功
	// 500 系统错误
	// 400 指定错误
	// 401 没有登录 或者 登录超时
	// const resData = {
	//     code: 500,
	//     success: false,
	//     message: data,
	// };
	// console.info(`请求错误：data: ${JSON.stringify(resData)}`);
	success: (data) => {
		const resData = {
			code: 200,
			success: true,
			data,
		};
		console.info('请求成功');
		return resData;
	},
	// 指定错误
	error: (err) => {
		const resData = {
			code: 500,
			success: false,
			message: err,
		};
		console.info(`请求错误：data: ${JSON.stringify(resData)}`);
		return resData;
	},
	// 登录失效
	loginError: (data) => ({
		code: 401,
		success: false,
		message: data || '请重新登录!',
	}),
};
