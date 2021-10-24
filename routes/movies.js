import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import customValidationUrl from '../utils/utils';

const moviesRouter = Router();

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(customValidationUrl),
  }),
}), createCards);
moviesRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCards);
moviesRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);
moviesRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

export default moviesRouter;
