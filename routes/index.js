import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import customValidationUrl from '../utils/utils';
import auth from '../middlewares/auth';
import { login, createUser, logout } from '../controllers/users';
import usersRouter from './users';
import moviesRouter from './movies';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', celebrate({ // убрать в валидарор схемы
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(customValidationUrl),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signout', logout);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
