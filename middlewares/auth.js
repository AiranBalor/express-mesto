const jwt = require('jsonwebtoken');
const AuthtorizationError = require('../errors/AuthtorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthtorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'no-secret-key');
  } catch (err) {
    throw new AuthtorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = auth;
