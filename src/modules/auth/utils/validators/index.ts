import { Request, Response } from 'express';
import Joi from 'joi';

export const loginValidator = async (
  request: Request,
  response: Response,
  next: any
) => {
  const schema = Joi.object()
    .keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    })
    .with('phone', 'pin');

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
  loginValidator,
};
