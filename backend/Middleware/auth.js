const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const { userId } = decodedToken;
    req.auth = {
      userId,
    };
    next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = auth;
