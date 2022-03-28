const express = require('express');
const router = express.Router();

const devRouter = require('./dev');
router.use('/dev', devRouter)

const authRouter = require('./auth');
const fileRouter = require('./file');

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 유저 추가, 로그인, 로그아웃
 */
router.use('/auth', authRouter)

router.use('/file', fileRouter)
module.exports = router;
