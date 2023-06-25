const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../../models/User');

passport.use(new GitHubStrategy(
	{
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: `${process.env.API_ORIGIN}/verify/github`
	},

	async function (accessToken, refreshToken, profile, done) {
		const {provider, id: providerId, name: displayName, email} = profile;
		let user = await User.findOne({provider, providerId}) || await new User(
			{
				displayName, 
				email, 
				provider, 
				providerId
			}
		).save();

		return done(null, user);
	}
));

module.exports = function(app) {
	app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

	app.get('/verify/github',
		passport.authenticate('github', { failureRedirect: '/login' }),

		function (req, res) {
			req.session.save(console.log);
			res.redirect(`${process.env.REACT_ORIGIN}/`);
		}
	);
}