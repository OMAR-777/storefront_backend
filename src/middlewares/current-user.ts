import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, IUserSerialized } from '../components/user/user.interfaces';
import User from '../components/user/user.model';
import { BadRequestError } from '../errors/bad-request-error';
import Logger from './logger';

interface UserPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserSerialized;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return next();
  }
  try {
    const bearerToken = req.headers.authorization; // "Bearer blablablablablabla"
    const token = bearerToken.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

    const user = await User.findOneById(payload.id);
    if (!user) {
      return next();
    }

    req.user = user;
  } catch (e) {
    Logger.error('JWT invalid signature');
  }

  next();
};
