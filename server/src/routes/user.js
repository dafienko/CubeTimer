const User = require('../models/User');

const checkUser = (req, res, next) => {
	if (!req.user) {
		res.status(401).send();
	} else {
		next();
	}
}

module.exports = function(app) {
	app.get('/me', checkUser, (req, res) => {
		res.redirect(`/user/${req.user._id}`);
	});

	app.get('/user/:id', checkUser, (req, res) => {
		if (!req.user.isAdmin && req.user._id != req.params.id) {
			res.status(403).send();
		}

		res.json(req.user);
	});
}