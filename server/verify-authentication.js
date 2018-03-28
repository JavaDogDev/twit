const verifyAuthentication = (req, res, next) => {
  // Check whether userId exists in session
  if (
    typeof req.session.userId !== 'string'
    && req.originalUrl !== '/login'
    && !req.originalUrl.startsWith('/dist/')
  ) {
    // Redirect GET requests to login page, error 401 for others
    if (req.method === 'GET') {
      return res.redirect('/login');
    }
    return res.status(401).end();
  }
  return next();
};

module.exports = verifyAuthentication;
