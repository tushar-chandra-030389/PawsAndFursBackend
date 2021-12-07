import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { connect } from './../utils/db';
import config from './../config';
import UserRouter from './../resources/user/user.router';
import LoginRouter from './../resources/login/login.router';
import { protect } from './../utils/auth';

export const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', protect);
app.use('/api/user', UserRouter);
app.use('/login', LoginRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error(error);
  }
};
