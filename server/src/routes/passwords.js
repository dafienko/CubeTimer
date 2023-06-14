const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');

function verifyPassword(password, salt, hash) {
	const key = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512');

	return key.toString('hex') === hash;
}

function hashPassword(plaintextPassword) {
	const salt = crypto.randomBytes(32).toString('hex');
	const password = pbkdf2.pbkdf2Sync(plaintextPassword, salt, 1, 32, 'sha512').toString('hex');

	return {salt, password};
}

module.exports = {verifyPassword, hashPassword};