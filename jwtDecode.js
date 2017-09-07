let jwt = require('jwt-simple')
let app = require('./server')

module.exports = function(req, res, next) {
	let token = (req.query && req.query.access_token) || (req.body && req.body.access_token) || req.cookies.access_token
	if(token) {
		try {
			let decode = jwt.decode(token, app.key);
			res.locals.decode = decode;
			next();
		}catch(err) {
			res.send({
				code: 100,
				msg: 'need login'
			})
		}
	}else {
		res.send({
			code: 100,
			msg: 'need login'
		})
	}
}