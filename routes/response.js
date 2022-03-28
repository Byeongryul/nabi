const response = (req, res) => {
  const result = {
    success: req.locals.isSuccess,
    data: req.locals.data,
    error: req.locals.error,
  }
  res.json(result)
}

module.exports = response;
