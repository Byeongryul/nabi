const express = require('express');

const { isLoggedIn } = require('./middlewares');

const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

const File = require('../models/File')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

/**
 * @swagger
 * paths:
 *  /file:
 *    get:
 *      summary: "유저 전체 파일 가져오기"
 *      description: "로그인한 유저의 전체 파일을 읽어옴"
 *      tags: [File]
 *      responses:
 *        "200":
 *          description: 파일을 성공적으로 가져옴
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
router.get('/', isLoggedIn, async (req, res, next) => {
  const user_id = req.session.passport.user;
  try{
    const files = await File.findAll({ where: { user_id } , order: [['updatedAt', 'DESC']]} );

    req.locals.data = {
      message : '모든 파일 찾기 성공',
      files : files
    };
  
    response(req, res);
  } catch(err){
    next(err);
  }
  
})

router.route('/:createdAt')
/**
 * @swagger
 * paths:
 *  /file/{createdAt}:
 *    post:
 *      summary: "파일을 저장합니다."
 *      description: "파일의 내용이 없을 수도 있습니다."
 *      tags: [File]
 *      requestBody:
 *        description: "타이틀과 컨텐츠가 없어도 됩니다."
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        "200":
 *          description: 파일 생성 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
  .post(isLoggedIn, async (req, res, next) => {
    const user_id = req.session.passport.user;
    const {createdAt} = req.params;
    const {title, content} = req.body;
    try {
      const ex_file = await File.findOne({ where: { user_id, createdAt} });
      if (ex_file) {
        const error = new Error(`exist`);
        error.status = 409;
        throw error;
      }

      await File.create({
        user_id,
        title,
        content,
        createdAt,
      });

      const file = await File.findOne({ where: {user_id, createdAt}})

      req.locals.data = {
        message : 'post success',
        file : file
      }
      response(req, res);
    } catch (err) {
      return next(err);
    }
  })
  /**
 * @swagger
 * paths:
 *  /file/{createdAt}:
 *    patch:
 *      summary: "파일을 수정합니다."
 *      description: "title 또는 content 중 둘다 수정이 가능합니다."
 *      tags: [File]
 *      requestBody:
 *        description: "타이틀과 컨텐츠가 없어도 됩니다."
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        "200":
 *          description: 파일 생성 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
  .patch(isLoggedIn, async (req, res, next) => {
    const user_id = req.session.passport.user;
    const {createdAt} = req.params;
    const {title, content} = req.body;
    try {
      const ex_file = await File.findOne({ where: { user_id, createdAt} });
      if (!ex_file) {
        const error = new Error(`not exist`);
        error.status = 409;
        throw error;
      }

      await File.update({
        title,
        content,
      }, {
        where: {
          user_id,
          createdAt,
        }
      });

      const file = await File.findOne({ where: {user_id, createdAt}})

      req.locals.data = {
        message : 'patch success',
        file : file
      }
      response(req, res);
    } catch (err) {
      return next(err);
    }
  })
 /**
 * @swagger
 * paths:
 *  /file/{createdAt}:
 *    delete:
 *      summary: "파일을 삭제합니다."
 *      description: "title 또는 content 중 둘다 수정이 가능합니다."
 *      tags: [File]
 *      responses:
 *        "200":
 *          description: 파일 삭제 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
  .delete(isLoggedIn,  async(req, res, next) => {
    const user_id = req.session.passport.user;
    const {createdAt} = req.params;
    try {
      const ex_file = await File.findOne({ where: { user_id, createdAt } });
      if (!ex_file) {
        const error = new Error(`not exist`);
        error.status = 409;
        throw error;
      }

      await File.destroy({
        where: {
          user_id,
          createdAt,
        }
      });

      req.locals.data = {
        message : 'delete success',
      }
      response(req, res);
    } catch (err) {
      return next(err);
    }
  })

module.exports = router;