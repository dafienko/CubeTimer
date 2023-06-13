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

	provider: String,
	providerId: String,

	username: String,
	password: String, 
	salt: String, 
});

module.exports = mongoose.model('User', userSchema);