import { Router } from 'express';
import {
  getMovies,
  createMovie,
  deleteMovie,
} from '../controllers/movies';
import { validateCreateMovie, validateDeleteteMovie } from '../middlewares/validations';

const moviesRouter = Router();

moviesRouter.get('/', getMovies);

moviesRouter.post('/', validateCreateMovie, createMovie);

moviesRouter.delete('/:movieId', validateDeleteteMovie, deleteMovie);

export default moviesRouter;
