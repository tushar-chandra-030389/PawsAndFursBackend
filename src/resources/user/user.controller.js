import _ from 'lodash';

import { UserModel } from './user.model';
import dbErrorReader from './../../utils/errors/dbError.readers';
import { newToken } from './../../utils/auth';

export const getUser = (req, res) => {
  const user = _.omit(req.user, ['createdAt', 'updatedAt', '_id', '__v']);
  res.send({ data: user });
};

export const addUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send({ message: 'In-valid data' });
  }

  try {
    const user = await UserModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    const token = newToken(user);
    return res.status(201).send({ data: token });
  } catch (error) {
    const dbError = dbErrorReader(error);

    if (dbError) {
      return res.status(400).send({ message: dbError }).end();
    }

    return res.status(400).send({ message: error.message }).end();
  }
};
