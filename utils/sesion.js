const session = require('express-session')
const connectRedis = require('connect-redis')
const redisClient = require('./redis')
const RedisStore = connectRedis(session)

module.exports = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'mySecret',
    resave: true,
    saveUninitialized: false,
    // resave: false,
    name: 'sessionId',
    cookie: {
        secure: false,
        // secure: true, //use https
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
        sameSite: 'lax',
    }
})