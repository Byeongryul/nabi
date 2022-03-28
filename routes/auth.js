const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { sequelize } = require('../models');
const { DataTypes } = require('Sequelize');
const User = require('../models/User')(sequelize, DataTypes);

const response = require('./response');
const router = express.Router(); 

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

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();

  req.locals.data = {
    message : 'logout success'
  }
  response(req, res)
});

module.exports = router;
