const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cardsData) => res.send(cardsData))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new ValidationError('Переданы неверные данные при создании карточки');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new Error('NotFound');
      throw error;
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Чужие карточки нельзя удалять');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((newCard) => res.status(200).send({ data: newCard }))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
        throw new NotFoundError(err.message);
      }
      throw new ValidationError('Переданы неверные данные при лайке карточки');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new NotFoundError(err.message);
      }
      throw new ValidationError('Переданы неверные данные при дизлайке карточки');
    })
    .catch(next);
};
