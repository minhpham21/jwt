const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then((result) => {
        console.log('Connected');
    }).catch((err) => {
        console.log('Error => ', err.message);
    });
}