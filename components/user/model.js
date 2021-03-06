const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name: { type: String, required: true},
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/ }
})

module.exports = mongoose.model('User', userSchema)