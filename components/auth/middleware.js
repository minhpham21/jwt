const jwt = require('jsonwebtoken');
const redisClient = require('../../utils/redis');
const userDal = require('../user/dal');
const bcrypt = require('bcrypt');

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const { user_name, email } = req.body;
    const isUserNamneUnique = (await userDal.getUserName(user_name)) ? true : false;
    const isEmailUnique = (await userDal.getEmail(email)) ? true : false;

    if (isEmailUnique) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate email'
        });
    }

    if (isUserNamneUnique) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate user_name'
        });
    }

    next();
}

exports.passwordNotRequired = (req, res, next) => {
    if (req.body.password === null || req.body.password === ''){
        return res.status(400).json({
            success: false,
            message: 'password is not required'
        });
    }
    next();
}

exports.login = async (req, res, next) => {
    const { user_name, password } = req.body;
    const user = await userDal.getUserName(user_name);
    req.user = user;

    if (!user) {
        return res.status(400).json({
            status: false,
            message: 'user_name is not valid'
        });
    }
    const isPasswordValid = bcrypt.compareSync(password.toString(), user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            status: false,
            message: 'password is not valid'
        });
    }

    next();
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.session.sid || req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userData = decoded;
        req.token = token;

        //blacklist token
        redisClient.get('BL_' + decoded.payload.toString(), (err, data) => {
            if (err) throw err;
            if (data === token) {
                return res.status(401)
                    .json({
                        status: false,
                        message: "blacklist token."
                    });
            }
            next();
        });
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: 'Your session is not valid',
            data: err
        });
    }
}

exports.verifyRefreshToken = async (req, res, next) => {
    const token = req.body.token;
    if (token === null) {
        return res.status(401).json({
            status: false,
            message: "Invalid request."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        req.userData = decoded;

        redisClient.get(decoded.payload.toString(), (err, data) => {
            if (err) {
                return res.json(err);
            }

            if (data === null) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid request. Token is not in store."
                });
            }

            if (JSON.parse(data).token != token) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid request. Token is not same in store."
                });
            }
            next()
        })
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: "Your session is not valid.",
            data: err
        })
    }
}