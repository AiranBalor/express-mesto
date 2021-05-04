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
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('NotFound');
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('NotFound');
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('NotFound');
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
