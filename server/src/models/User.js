const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.USER_URI);

const userSchema = new Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	
	name: {
		type: String, 
		required: true 
	}, 

	email: String, 

	isAdmin: {
		type: Boolean, 
		default: false
	}, 

	date: { 
		type: Date, 
		default: Date.now 
	},

	solves: [{
		_id: false,
		time: Number,
		scramble: String,
	}],

	colorTheme: {
		_id: false,
		primary: {
			type: String,
			default: '#FFFFFF',
		},
		secondary: {
			type: String,
			default: '#FF0000',
		},
		tertiary: {
			type: String,
			default: '#DD0000',
		},
		quaternary: {
			type: String,
			default: '#AA0000',
		},
		timer: {
			type: String,
			default: '#000000',
		},
		ao: {
			type: String,
			default: '#202020',
		},
	},

	provider: String,
	providerId: String,

	username: String,
	password: String, 
	salt: String, 
});

module.exports = mongoose.model('User', userSchema);