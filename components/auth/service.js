const jwt = require('jsonwebtoken');
const redisClient = require('../../utils/redis');
const userDal = require('../user/dal');
const bcrypt = require('bcrypt');

exports.addUser = async user => {
	const { name, email, password, user_name } = user;

	const newUser = {
		user_name: user_name,
		password: bcrypt.hashSync(password.toString(), 10),
		name: name,
		email: email
	};

	const data = await userDal.store(newUser);
	return data;
}

exports.generateToken = async (payload, secretSignature, tokenLife) => {
	try {
		return await jwt.sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch (error) {
		console.log( 'ERROR generateToken: ', error);
		return null;
	}
}

exports.generateRefreshToken = async user_id => {
	const refreshToken = await this.generateToken(user_id, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

	if (!refreshToken) return null;

	redisClient.get(user_id.toString(), (err, data) => {
		if (err) throw err;
		
		redisClient.set(user_id.toString(), JSON.stringify({ token: refreshToken }));
	})

	return refreshToken;
}