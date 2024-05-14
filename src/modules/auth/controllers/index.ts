import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../shared/types/controllers.types';
import authServices from '../services/index';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';
import middlewaresInstance from '../middlewares';
import authValidators from '../utils/validators';

export default class AuthControllers implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  private middlewares = middlewaresInstance;
  private authValidators = authValidators;

  constructor() {
    this.loadRoutes();
  }

  private loadRoutes() {
    this.router.post(
      `${this.path}/users/login`,
      this.authValidators.loginValidator,
      this.login
    );
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authServices.login(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
}
