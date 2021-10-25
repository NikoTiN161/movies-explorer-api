import { Router } from 'express';
import {
  getUserMe,
  updateUserInfo,
} from '../controllers/users';
import { validateUserInfo } from '../middlewares/validations';

const usersRouter = Router();

usersRouter.get('/me', getUserMe);
usersRouter.patch('/me', validateUserInfo, updateUserInfo);

export default usersRouter;
