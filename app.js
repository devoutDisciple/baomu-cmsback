// const dash = require('appmetrics-dash');

// // 监控前端性能
// dash.monitor({
// 	url: '/monitor',
// 	port: 3335,
// });

const express = require('express');

const app = express();
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const sessionParser = require('express-session');
const config = require('./config/config');
const controller = require('./controller/index');
const LogMiddleware = require('./middleware/LogMiddleware');
const loginMiddleware = require('./middleware/loginMiddleware');
// require('./schedule');

// 解析cookie和session还有body
app.use(cookieParser(config.cookieSign)); // 挂载中间件，可以理解为实例化

app.use(
	sessionParser({
		secret: 'ruidoc', // 签名，与上文中cookie设置的签名字符串一致，
		cookie: {
			maxAge: 90000,
		},
		name: 'session_id', // 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: false,
		saveUninitialized: true,
	}),
);

app.use(express.static(config.staticPath));
// 前端资源存放地址
app.use(express.static(config.sourcePath));

// parse application/json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// 改变默认的log
// ChangeLog.changeLog();

// // 改变默认的info
// ChangeLog.changeInfo();

// // 改变默认的error
// ChangeLog.changeError();

// 自定义日志
app.use(LogMiddleware);

app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', true); // 可以带cookies
	res.header('X-Powered-By', '3.2.1');
	next();
});

// 判断用户是否登录
app.use(loginMiddleware);

// 路由 controller层
controller(app);

// 监听8888端口
app.listen(config.port, () => {
	console.log(chalk.yellow(`env: ${config.env}, server is listenning ${config.port}`));
});
