const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../../models/User');

passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${process.env.API_ORIGIN}/verify/google`,
		passReqToCallback: true
	},
	
	async function (request, accessToken, refreshToken, profile, done) {
		const {provider, id: providerId, name: displayName, email} = profile;
		let user = await User.findOne({provider, providerId}) || await new User(
			{
				name: displayName.givenName, 
				email, 
				provider, 
				providerId
			}
		).save();

		return done(null, user);
	}
));

module.exports = function(app) {
	app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

	app.get('/verify/google',
		passport.authenticate('google', { failureRedirect: '/login' }),

		function (req, res) {
			req.session.save(console.log);
			res.redirect(`${process.env.REACT_ORIGIN}/`);
		}	
	);
}