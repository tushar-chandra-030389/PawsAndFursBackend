import jwt from 'jsonwebtoken';
import randToken from 'rand-token';

import { UserModel } from './../../resources/user/user.model';
import config from './../../config/index';

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (error, payload) => {
      if (error) return reject(error);
      resolve(payload);
    });
  });

export const getRefreshToken = () => {
  return randToken.uid(16);
};

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'Please login' }).end();
    return;
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Please login' }).end();
    return;
  }

  try {
    const payload = await verifyToken(token);
    const user = await UserModel.findById(payload.id)
      .select({ password: 0 })
      .lean({ virtuals: true })
      .exec();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message }).end();
    return;
  }
};
