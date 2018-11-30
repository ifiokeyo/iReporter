const adminValidator = async (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).send({
    error: {
      message: 'Request denied'
    }
  })
}

export default adminValidator;