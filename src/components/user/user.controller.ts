import { Request, Response } from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import { ICreateUser, IUserSerialized } from './user.interfaces';
import { Password } from '../../utils/password';
import User from './user.model';
import { NotFoundError } from '../../errors/not-found-error';
import CustomResponse from '../../utils/custom-response';
import { JWT } from '../../utils/jwt';

class UserController {
  async getProfile(req: Request, res: Response) {
    CustomResponse.send(res, { profile: req.user });
  }

  async getUser(req: Request, res: Response) {
    const user = await User.findOneById(+req.params.id);
    if (!user) {
      throw new NotFoundError('User Not Found!');
    }
    CustomResponse.send(res, { user });
  }

  async getUsers(req: Request, res: Response) {
    const users = await User.findAll();
    CustomResponse.send(res, { users });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOneByEmail(email);
    if (!user) {
      return CustomResponse.sendWithError(res, 'Invalid Credentials!', 404);
    }

    const isMatch = await Password.compare(user.password, password);
    if (isMatch) {
      const token = JWT.sign(user);

      const userSerialization = user as IUserSerialized;
      userSerialization.password = undefined;

      const result = { user: userSerialization, token };
      CustomResponse.send(res, result, `Welcome Back, ${user.firstname}`);
    } else {
      return CustomResponse.sendWithError(res, 'Invalid Credentials!', 400);
    }
  }

  async signUp(req: Request, res: Response) {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestError("There's a user with this email already!");
    }
    const hashedPassword = await Password.toHash(password);

    const dataObject: ICreateUser = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
    };

    const user = await User.create(dataObject);
    if (user) {
      // Creating a JWT token for this user, and returning it back in the response
      // so that it can be used in the Authentication process
      const token = JWT.sign(user);
      const result = { user, token };

      return CustomResponse.send(res, result, 'Created Successfully', 201);
    } else {
      throw new Error();
    }
  }

  async createMany(req: Request, res: Response) {
    const users = req.body as ICreateUser[];
    let insertedUsers: IUserSerialized[] = [];
    let errorUsers: [reason: string, user: ICreateUser][] = [];

    for (let i = 0; i < users.length; i++) {
      var userFound = await User.findOneByEmail(users[i].email);
      if (userFound) {
        errorUsers.push(["There's a user with this email already!", users[i]]);
        continue;
      }

      const hashedPassword = await Password.toHash(users[i].password);
      users[i].password = hashedPassword;

      const newUser = await User.create(users[i]);
      if (newUser) {
        insertedUsers.push(newUser);
      } else {
        errorUsers.push(['Could not insert this user', users[i]]);
      }
    }

    const result = {
      insertedCount: insertedUsers.length,
      errorCount: errorUsers.length,
      insertedUsers,
      errorUsers,
    };

    if (insertedUsers.length) {
      if (errorUsers.length == 0) {
        return CustomResponse.send(
          res,
          insertedUsers,
          'All Users Created Successfully',
          201,
        );
      } else {
        return CustomResponse.send(
          res,
          result,
          'Some Users Created Successfully',
          201,
        );
      }
    } else {
      return CustomResponse.sendWithErrorAndData(
        res,
        result,
        'No User is Created Susccessfully',
      );
    }
  }
}

export default new UserController();
