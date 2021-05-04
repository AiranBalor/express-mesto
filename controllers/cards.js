const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cardsData) => res.send(cardsData))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('NotFound');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('NotFound');
      error.statusCode = 404;
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('NotFound');
      error.statusCode = 404;
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      console.log(err);
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
