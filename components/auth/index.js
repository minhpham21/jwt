const express = require('express');
const router = express.Router();
const authController = require('./controller');
const { verifyToken, verifyRefreshToken, checkDuplicateUsernameOrEmail, login, passwordNotRequired } = require('./middleware');


router.post('/register', [checkDuplicateUsernameOrEmail, passwordNotRequired], authController.register);
router.post('/refresh', verifyRefreshToken, authController.refreshToken);
router.post('/login', login, authController.login);
router.get('/logout', verifyToken, authController.logout);

module.exports = router;