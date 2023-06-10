
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('../../models/User');

const sessionStore = new MongoDBStore({
	uri: process.env.SESSION_URI,
	ttl: 14 * 24 * 60 * 60,
	collection: 'sessions'
});

module.exports = function(app) {
	app.use(session({
		secret: 'secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: false,
		},
		store: sessionStore
	}));

	sessionStore.on('error', function (error) {
		console.log(error);
	});
	
	passport.serializeUser(async function (user, done) {
		done(null, user._id);
	}); 

	passport.deserializeUser(async function (id, done) {
		done(null, await User.findById(id));
	});

	app.use(passport.initialize());
	app.use(passport.session());
	
	const checkSignedIn = (req, res, next) => {
		if (!req.user) {
			return res.status(401).send();
		} else {
			return next();
		}
	};

	app.get('/validSession', checkSignedIn, (req, res) => {
		return res.status(200).send();
	})
	
	app.get('/logout', checkSignedIn, function(req, res, next) {
		req.logout(function(err) {
			if (err) { return next(err); }
			
			req.session.destroy();
	
			res.send('logged out');
		});
	})
}