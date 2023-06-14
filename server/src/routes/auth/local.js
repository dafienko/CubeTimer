const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');
const User = require('../../models/User');
const { hashPassword, verifyPassword } = require('../passwords');

passport.use(new LocalStrategy(
	async function(username, password, done) {
		const user = await User.findOne({username});
		if (!user) {
			return done(null);
		}

		if (!verifyPassword(password, user.salt, user.password)) {
			return done(null);
		}

		return done(null, user);
	}
));

const checkAuth = passport.authenticate('local', { 
	session: true,
});

module.exports = function(app) {
	app.post('/auth/basic/login', checkAuth, (req, res) => {
		res.send();
	});

	app.post('/auth/basic', async (req, res) => {
		const {username, password: plaintextPassword} = req.body;
		if (!(username && plaintextPassword)) {
			return res.status(400).send("Request must contain name, email, username, and password");
		}
		
		if (await User.findOne({username})) {
			return res.status(400).send("Username taken");
		}
		
		const {salt, password} = hashPassword(plaintextPassword);

		await new User({username, password, name: username, salt}).save();
		
		checkAuth(req, res, function() {
			res.send();
		})
	});
}