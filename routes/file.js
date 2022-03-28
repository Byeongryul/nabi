const express = require('express');

const { isLoggedIn } = require('./middlewares');

const { sequelize } = require('../models');
const { DataTypes } = require('Sequelize');

const File = require('../models/File')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

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