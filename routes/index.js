import { Router } from 'express';
import auth from '../middlewares/auth';
import { login, createUser, logout } from '../controllers/users';
import usersRouter from './users';
import moviesRouter from './movies';
import NotFoundError from '../errors/NotFoundError';
import { validateSignin, validateSignup } from '../middlewares/validations';

const router = Router();

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);
router.post('/signout', logout);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
