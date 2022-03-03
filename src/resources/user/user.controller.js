import _ from 'lodash';

import { UserModel } from './user.model';
import { RefreshTokenModel } from './../refreshToken/refreshToken.model';
import dbErrorReader from './../../utils/errors/dbError.readers';
import { newToken, getRefreshToken } from './../../utils/auth';

export const getUser = async (req, res) => {
  const user = _.omit(req.user, ['createdAt', 'updatedAt', '_id', '__v']);
  res.send({ data: user });
};

export const addUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).send({ message: 'In-valid data' });
    return;
  }

  try {
    const user = await UserModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    const token = newToken(user);
    const refreshToken = getRefreshToken();
    const refreshTokenInstance = new RefreshTokenModel({
      token: refreshToken,
      userId: user.id,
    });
    await refreshTokenInstance.save();
    res
      .status(201)
      .send({ data: { token, refreshToken: refreshTokenInstance.token } });

    return;
  } catch (error) {
    const dbError = dbErrorReader(error);

    if (dbError) {
      res.status(400).send({ message: dbError }).end();
      return;
    }

    res.status(400).send({ message: error.message }).end();
    return;
  }
};
