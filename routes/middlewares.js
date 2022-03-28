exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const error = new Error(`로그인이 필요`);
    error.status = 403;
    next(error);
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const error = new Error(`로그인한 상태`);
    error.status = 403;
    next(error);
  }
};
