import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMovies,
  createMovie,
  deleteMovie,
} from '../controllers/movies';
import customValidationUrl from '../utils/utils';

const moviesRouter = Router();

moviesRouter.get('/', getMovies);

moviesRouter.post('/', createMovie);

// celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().custom(customValidationUrl),
//   }),
// }),

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

export default moviesRouter;
