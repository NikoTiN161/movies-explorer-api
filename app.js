import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import handleErrors from './middlewares/handleErrors';
import router from './routes';

const {
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
  PORT = 3001,
  DOMIANS = ['https://mesto.nikotin.nomoredomains.club', 'http://mesto.nikotin.nomoredomains.club', `localhost:${PORT}`],
  METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
} = process.env;

const corsOptions = {
  origin: DOMIANS,
  optionsSuccessStatus: 204,
  methods: METHODS,
  credentials: true,
};

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(MONGO_URL);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
