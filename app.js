
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const logger = require('morgan');
const passport = require('passport');
const { swaggerUi, specs } = require('./swagger/swagger');

dotenv.config();

const indexRouter = require('./routes');
const response = require('./routes/response')

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.set('port', process.env.PORT || 3000);
//app.set('env', 'development')
passportConfig();

sequelize.sync({ force: false })
  .then(() => {
    console.log(app.get('port') + ' DB Connection');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.locals = {
    isSuccess : true,
  };
  next();
})

app.use('/', indexRouter);
//app.use('/auth', authRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(specs));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  req.locals.isSuccess = false;
  req.locals.error = {
    message : err.message,
    locals : err.locals,
  }
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);

  if (res.locals.error !== undefined & res.locals.data !== undefined){
    console.log(res.locals);
    throw new Error('error와 data가 공존함')
  }
  console.error(err);
  response(req, res);
  next();
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
