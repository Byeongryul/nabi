const express = require('express');

const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

const User = require('../models/User')(sequelize, DataTypes);
const File = require('../models/File')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

/**
 * @swagger
 * paths:
 *  /dev/user:
 *    get:
 *      summary: "유저 데이터 전체 조회"
 *      description: "개발용"
 *      tags: [Dev]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: "성공 이유"
 *                      users:
 *                        type: object
 */
router.get('/user', async (req, res) => {
  const users = await User.findAll();
  
  req.locals.data = {
    message : '모든 유저 찾기 성공',
    users : users
  }

  response(req, res);
})
/**
 * @swagger
 *  /dev/file:
 *    get:
 *      summary: "파일 데이터 전체 조회"
 *      description: "개발용"
 *      tags: [Dev]
 *      responses:
 *        "200":
 *          description: "전체 파일 정보"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        description: "모든 파일 찾기 성공"
 *                      files:
 *                        type: object
 */
router.get('/file', async (req, res) => {
  const files = await File.findAll();
  
  req.locals.data = {
    message : '모든 파일 찾기 성공',
    files : files
  }

  response(req, res);
})

module.exports = router;