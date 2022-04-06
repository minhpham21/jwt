const { getProfile } = require('./service')

exports.show = async (req, res) => {
    const data = await getProfile(req.params.id);

    return res.status(200).json({
        data: data
    })
}