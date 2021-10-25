import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserMe,
  updateUserInfo,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/me', getUserMe);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

export default usersRouter;
