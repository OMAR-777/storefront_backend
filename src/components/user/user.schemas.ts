import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const getUserValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }).required(),
};

const UserValidationJoiObject = {
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

export const createUserValidation: IValidationSchema = {
  body: Joi.object(UserValidationJoiObject),
};

export const createUsersValidation: IValidationSchema = {
  body: Joi.array().items(Joi.object(UserValidationJoiObject)),
};
