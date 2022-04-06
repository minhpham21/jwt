const express = require('express');
const router = express.Router();
const userController = require('./controller');

router.get('/:id', userController.show)

module.exports = router;