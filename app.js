import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { celebrate, errors, Joi } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import handleErrors from './middlewares/handleErrors';
import auth from './middlewares/auth';

const { MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const { PORT = 3001 } = process.env;
const { DOMIANS = ['https://mesto.nikotin.nomoredomains.club', 'http://mesto.nikotin.nomoredomains.club', `localhost:${PORT}`] } = process.env;

const corsOptions = {
  origin: DOMIANS,
  optionsSuccessStatus: 204,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
mongoose.connect(MONGO_URL);
app.use(requestLogger);

// не защищеные роуты

app.use(auth);

// защищеные роуты

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});