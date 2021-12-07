import _ from 'lodash';

import { UserModel } from './../user/user.model';
import { newToken } from './../../utils/auth';
import { addUser } from './../user/user.controller';

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'In-valid sign in data' });
  }

  try {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      res.status(401).send({ message: 'Invalid credentials' }).end();
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      res.status(401).send({ message: 'Invalid credentials' }).end();
    }

    const token = newToken(user);
    res.status(201).send({ data: token });
  } catch (error) {
    const dbError = dbErrorReader(error);

    if (dbError) {
      return res.status(400).send({ message: dbError }).end();
    }

    return res.status(400).send({ message: error.message }).end();
  }
};

export const signUp = (req, res) => {
  addUser(req, res);
};
