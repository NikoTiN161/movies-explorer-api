import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/NotFoundError';
import ConflictError from '../errors/ConflictError';

const { NODE_ENV, JWT_SECRET } = process.env;

export const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        });
      res.send({ email: user.email, _id: user._id, message: 'Успешный вход' });
    })
    .catch(next);
};

export const logout = (req, res) => {
  res
    .cookie('jwt', '', {
      maxAge: -1,
    });
  res.send({ message: 'Успешный выход' });
};

export const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then((user) => {
          res.send({
            data: {
              email: user.email,
              name: user.name,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'MongoServerError' && err.code === 11000) {
            return next(new ConflictError('Такой email уже существует'));
          }
          return next(err);
        });
    })
    .catch(next);
};

export const getUserMe = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch(next);
};

export const updateUserInfo = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError('Такой email уже существует'));
      }
      return next(err);
    });
};
