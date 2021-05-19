const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthtorizationError = require('../errors/AuthtorizationError');
const AlreadyExistUserError = require('../errors/AlreadyExistUserError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('NotFound');
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
      } else if (err.kind === 'ObjectId') {
        throw new ValidationError('Неверный id пользователя');
      }
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('Пользователя с указанным id не существует');
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректный Id');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new AuthtorizationError('Неверная почта или пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          throw new AlreadyExistUserError('Пользователь с таким email уже существует');
        } else if (err.name === 'ValidationError' || err.name === 'CastError') {
          throw new ValidationError('Передана некорретная почта или пароль');
        }
      })
      .catch(next));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new ValidationError('Введенные данные о пользователе некорректны');
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'no-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthtorizationError(err.message);
    })
    .catch(next);
};
