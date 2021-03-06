const {
  celebrate,
  Joi,
} = require('celebrate');

const validateId = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .alphanum()
        .hex()
        .length(24),
    }),
});

const validateCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .alphanum()
        .hex()
        .length(24),
    }),
});

const validateCard = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .pattern(/https?:\/\/(w{3}\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,300}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    }),
});

const validateUserDescription = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
});

const validateUserAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .pattern(/https?:\/\/(w{3}\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,300}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    }),
});

const validateSignUp = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(/https?:\/\/(w{3}\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,300}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(2),
    }),
});

const validateSignIn = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(2),
    }),
});

module.exports = {
  validateId,
  validateUserDescription,
  validateCard,
  validateUserAvatar,
  validateSignUp,
  validateSignIn,
  validateCardId,
};
