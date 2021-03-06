import Movie from '../models/movie';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ForbiddenError from '../errors/ForbiddenError';

export const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user,
    movieId,
    nameRU,
    nameEN,
  })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      Movie.findOne({ movieId })
        .populate('owner')
        .then((newMovie) => {
          res.send(newMovie);
        })
        .catch(next);
    })
    .catch(next);
};

export const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id === movie.owner.toString()) {
        movie.remove()
          .then(() => res.send({ message: movie }))
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не владелец карточки');
      }
    })
    .catch(next);
};
