const User = require('../models/User');

const checkUser = (req, res, next) => {
	if (!req.user) {
		res.status(401).send();
	} else {
		next();
	}
}

const userCanAccess = (req, res, next) => {
	if (!req.user.isAdmin && req.user._id != req.params.id) {
		return res.status(403).send();
	}

	next();
}

module.exports = function(app) {
	app.get('/me', checkUser, (req, res) => {
		res.redirect(`/user/${req.user._id}`);
	});

	app.get('/user/:id', checkUser, userCanAccess, (req, res) => {
		res.json({
			name: req.user.name,
			id: req.user._id
		});
	});

	app.post('/solves/:id', checkUser, userCanAccess, async (req, res) => {
		await User.updateOne(
			{
				_id: req.user._id
			}, 
			{
				$push: { solves: {time: req.body.time} } 
			}
		);

		res.send();
	});

	app.get('/solves/:id', checkUser, userCanAccess, (req, res) => {
		const num = req.query.num || 20;
		const last = req.user.solves.length;
		const first = Math.max(0, last - num);
		res.json(req.user.solves.slice(first, last));
	});
}