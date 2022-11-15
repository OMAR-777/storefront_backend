import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const getOrderValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }).required(),
};

export const getOrderProductsValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }).required(),
};

export const createOrderValidation: IValidationSchema = {
  body: Joi.object({
    user_id: Joi.number().required(),
  }).required(),
};

export const addOrderProductValidation: IValidationSchema = {
  body: Joi.object({
    order_id: Joi.number().required(),
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
  }).required(),
};
