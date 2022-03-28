const express = require('express');

const { sequelize } = require('../models');
const { DataTypes } = require('Sequelize');

const User = require('../models/User')(sequelize, DataTypes);
const File = require('../models/File')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

router.get('/user', async (req, res) => {
  const users = await User.findAll();
  
  req.locals.data = {
    message : '모든 유저 찾기 성공',
    users : users
  }

  response(req, res);
})

router.get('/file', async (req, res) => {
  const files = await File.findAll();
  
  req.locals.data = {
    message : '모든 파일 찾기 성공',
    files : files
  }

  response(req, res);
})

module.exports = router;