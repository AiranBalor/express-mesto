const express = require('express');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  validateSignUp,
  validateSignIn,
} = require('./middlewares/validation');
const mainErrorshHandler = require('./middlewares/mainErrorsHandler');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Слишком много запросов к серверу, пожалуйста, подождите 15 минут',
});

app.use(bodyParser.json());

app.use(limiter);
app.use(helmet());

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors());

app.use(mainErrorshHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
