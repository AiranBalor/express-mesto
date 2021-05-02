/* eslint-disable no-unused-vars */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValid') {
        return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValid'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      } if (err.message === 'NotValid') {
        return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(new Error('NotValid'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      } if (err.message === 'NotValid') {
        return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      }
      return res.status(500).send({ message: err.message });
    });
};
