const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    if (err.name === 'TokenExpiredError') {
      return next(new Error('Not authorized, token expired'));
    }
    return next(new Error('Not authorized, token invalid'));
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
