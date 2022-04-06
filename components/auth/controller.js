const redisClient = require('../../utils/redis');
const { addUser, generateToken, generateRefreshToken } = require('./service');

exports.register = async (req, res) => {
    try {
        const data = await addUser(req.body);

        if (data.errors) {
            return res.status(400).json({
                success: false,
                message: data.errors
            });
        }

        return res.status(200).json({
            success: true,
            message: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error'
        })
    }
}

exports.login = async (req, res) => {
    const user = req.user;
    const accessToken = await generateToken(user._id, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
    const refreshToken = await generateRefreshToken(user._id);

    if (!accessToken) {
        return res.status(500).json({
            success: false,
            message: 'error'
        });
    }

    var session;
    session = req.session;
    session.sid = accessToken;

    return res.status(200).json({
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

exports.logout = async (req, res) => {
    const user_id = req.userData.payload;
    const token = req.token;

    await redisClient.del(user_id.toString());
    await redisClient.set('BL_' + user_id.toString(), token);
    await req.session.destroy();

    return res.status(200).json({
        success: true,
        message: "success."
    });
}

exports.refreshToken = async (req, res) => {
    const user_id = req.userData.payload;
    const accessToken = await generateToken(user_id, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
    const refreshToken = await generateRefreshToken(user_id);

    if (!accessToken) {
        return res.status(500).json({
            success: false,
            message: 'error'
        });
    }

    return res.status(200).json({
        success: true,
        data: { accessToken, refreshToken }
    });
}