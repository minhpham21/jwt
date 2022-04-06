const User = require('./model')

exports.store = async user => {
    try {
        const newUser = new User(user);
        return await newUser.save();
    } catch (error) {
        return (error);
    }
}

exports.getUserName = async userName => {
    return await User.findOne({user_name: userName});
}

exports.getEmail = async email => {
    return await User.findOne({email: email});
}

exports.getUserId = async userId => {
    return await User.findOne({ _id: userId });
}
