const jwt = require("jsonwebtoken");

const auth = () => {
  try {
    const token = req.headers.authorization.split(" "[1]);
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = auth;
