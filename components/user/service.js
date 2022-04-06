const userDal = require('./dal')


// exports.getProfile = async userId => {

// }

exports.getProfile = async userId => {
    const data = await userDal.getUserId(userId );
    if (!data) return null;
    return {
        name: data.name,
        email: data.email
    };
}