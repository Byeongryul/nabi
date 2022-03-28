const passport = require('passport');
const local = require('./localStrategy');

const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');
const User = require('../models/User')(sequelize, DataTypes);

module.exports = () => {
  // 로그인할 때
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // 요청할 때
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
