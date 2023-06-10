const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');
const User = require('../User');

passport.use(new LocalStrategy(
	async function(username, password, done) {
		console.log(username, password);
		const user = await User.findOne({username});
		if (!user) {
			console.log('1');
			return done(null);
		}

		if (!verifyPassword(password, user.salt, user.password)) {
			console.log('2');
			return done(null);
		}

		console.log('3');
		return done(null, user);
	}
));

function verifyPassword(password, salt, hash) {
	const key = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512');

	return key.toString('hex') === hash;
}

const checkAuth = passport.authenticate('local', { 
	session: true,
	failureRedirect : 'http://localhost:3000/login'
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
		
		const salt = crypto.randomBytes(32).toString('hex');
		const password = pbkdf2.pbkdf2Sync(plaintextPassword, salt, 1, 32, 'sha512').toString('hex');

		await new User({username, password, name: username, salt}).save();
		
		checkAuth(req, res, function() {
			res.send();
		})
	});
}