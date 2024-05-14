import { Request, Response } from 'express';
import Joi from 'joi';

const createCustomerValidator = async (
  request: Request,
  response: Response,
  next: any
) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string(),
    state: Joi.string().required(),
    lga: Joi.string().required(),
    country: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(14).required(),
    pin: Joi.string().min(4).max(4).required(),
    profileImage: Joi.string(),
  });

  try {
    await schema.validateAsync(request.body);
    return next();
  } catch (err: any) {
    return response
      .status(400)
      .json({ status: 'error', message: `${err.details[0].message}` });
  }
};

const createVendorValidator = async (
  request: Request,
  response: Response,
  next: any
) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    featuredImage: Joi.string().required(),
    image: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    type: Joi.string().required(),
    opensAt: Joi.string().required(),
    closesAt: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().min(11).max(14).required(),
  });

  try {
    await schema.validateAsync(request.body);
    return next();
  } catch (err: any) {
    return response
      .status(400)
      .json({ status: 'error', message: `${err.details[0].message}` });
  }
};

export default {
  createVendorValidator,
  createCustomerValidator,
};
