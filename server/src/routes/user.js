const User = require('../models/User');
const { verifyPassword, hashPassword } = require('./passwords');

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
		res.redirect(`${process.env.API_ORIGIN}/user/${req.user._id}`);
	});

	app.get('/user/:id', checkUser, userCanAccess, async (req, res) => {
		const user = await User.findOne({_id: req.params.id});

		res.json({
			id: req.params.id,
			name: user.name,
			colorTheme: user.colorTheme,
		});
	});

	app.get('/user/:id/solves', checkUser, userCanAccess, async (req, res) => {
		const user = await User.findOne({_id: req.params.id});

		const num = req.query.num || req.user.solves.length;
		const last = user.solves.length;
		const first = Math.max(0, last - num);
		res.json(user.solves.slice(first, last));
	});

	app.post('/user/:id/solves', checkUser, userCanAccess, async (req, res) => {
		await User.updateOne(
			{
				_id: req.params.id
			}, 
			{
				$push: { solves: {time: req.body.time, scramble: req.body.scramble} } 
			}
		);

		res.send();
	});

	app.delete('/user/:id/solves', checkUser, userCanAccess, async (req, res) => {
		if (!req.body.scramble) {
			return res.status(400).send();
		}

		await User.updateOne(
			{
				_id: req.params.id
			}, 
			{
				$pull: {solves: {scramble: req.body.scramble}}
			}
		);

		res.send();
	});

	app.put('/user/:id/solves', checkUser, userCanAccess, async (req, res) => {
		console.log(req.body.scramble, req.body.add2)

		await User.updateOne(
			{
				_id: req.params.id,
				'solves.scramble': req.body.scramble
			}, 
			{
				$set: {'solves.$.add2': req.body.add2}
			}
		);

		res.send();
	});

	app.post('/user/:id/theme', checkUser, userCanAccess, async (req, res) => {
		const HEX_REGEX = /^#(?:[0-9a-f]{3}){1,2}$/i;
		function validateColor(colorname) {
			const match = req.body[colorname] && req.body[colorname].toLowerCase().match(HEX_REGEX);
			return match ? match[0] : undefined;
		}

		const newColorTheme = {};
		for (const colorName of ['primary', 'secondary', 'tertiary', 'quaternary', 'timer', 'ao']) {
			const col = validateColor(colorName);
			if (col) {
				newColorTheme[colorName] = col;
			}
		}

		await User.updateOne(
			{
				_id: req.params.id,
			}, 
			{
				colorTheme: newColorTheme,
			}
		);

		res.send();
	});

	app.put('/user/:id/password', checkUser, userCanAccess, async (req, res) => {
		const user = await User.findOne({_id: req.params.id});
		if (user.provider) {
			return res.status(400).send();
		}

		if (!verifyPassword(req.body.currentPassword, user.salt, user.password)) {
			return res.status(400).send();
		}

		const {password, salt} = hashPassword(req.body.newPassword);

		await User.updateOne(
			{_id: req.params.id},
			{password, salt}
		)

		res.send();
	});
}