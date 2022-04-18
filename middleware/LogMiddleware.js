const logMiddleware = (req, res, next) => {
	const { method, originalUrl } = req;
	let params = '';
	let url = originalUrl;
	if (url && url.includes('?')) {
		url = url.split('?')[0];
	}
	if (method === 'GET') {
		params = JSON.stringify(req.query);
	}
	if (method === 'POST') {
		params = JSON.stringify(req.body);
	}
	console.log(`method: ${method} url: ${url} params: ${params}`);
	next();
};

module.exports = logMiddleware;
