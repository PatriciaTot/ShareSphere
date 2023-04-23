var express = require('express');

var router = express.Router();

const userController = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/authentication.middleware');

/* GET users listing. */
router.get('/me', authMiddleware.validToken, userController.me);

module.exports = router;
