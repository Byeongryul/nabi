const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');
const User = require('../models/User')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

/**
 * @swagger
 * paths:
 *  /auth/join:
 *    post:
 *      summary: "회원가입"
 *      description: "이메일과 비밀번호로 회원가입한다"
 *      tags: [Auth]
 *      requestBody:
 *        description: "결과가 다를 수 있습니다."
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        "200":
 *          description: 회원가입 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      const error = new Error(`exist`);
      error.status = 409;
      next(error);
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hash,
    });
    
    req.locals.data = {
      message : 'join success'
    }
    response(req, res);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: "로그인"
 *      description: "이메일과 비밀번호로 로그인한다"
 *      tags: [Auth]
 *      requestBody:
 *        description: "결과가 다를 수 있습니다."
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        "200":
 *          description: 로그인 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      const error = new Error(`${info.message}`);
      error.locals = {
        type : 'login',
      }
      error.status = 409;
      return next(error);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      req.locals.data = {
        message : 'login success',
      }
      response(req, res)
    });
  })(req, res, next);
});

/**
 * @swagger
 *  /auth/logout:
 *    get:
 *      summary: "로그아웃"
 *      description: "로그아웃 한다"
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: 회원가입 성공
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();

  req.locals.data = {
    message : 'logout success'
  }
  response(req, res)
});

module.exports = router;
