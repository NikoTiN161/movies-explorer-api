import Movie from '../models/movie';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ForbiddenError from '../errors/ForbiddenError';

// убрать throw

export const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
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
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id === card.owner.toString()) {
        Movie.findByIdAndRemove({ _id: req.params.cardId })
          .then((data) => {
            if (!data) {
              throw new ReferenceError();
            }
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не владелец карточки');
      }
    })
    .catch(next);
};

// export const like = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .populate(['owner', 'likes'])
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Карточка не найдена');
//       }
//       res.send(card);
//     })
//     .catch(next);
// };

// export const dislike = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .populate(['owner', 'likes'])
//     .then((card) => {
//       if (card) {
//         res.send(card);
//       } else throw new ReferenceError();
//     })
//     .catch(next);
// };
