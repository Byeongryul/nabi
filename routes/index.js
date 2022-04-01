const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Dev
 *  description: 개발 전용
 */
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

/**
 * @swagger
 * tags:
 *  name: File
 *  description: 로그인을 해야 작동합니다.
 */
router.use('/file', fileRouter)
module.exports = router;
