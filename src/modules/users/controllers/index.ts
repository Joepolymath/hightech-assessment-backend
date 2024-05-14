import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../shared/types/controllers.types';
import userServices from '../services/index';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';

export default class UserController implements Controller {
  public readonly path: string = '/users';
  public readonly router: Router = Router();

  constructor() {
    this.loadRoutes();
  }

  private loadRoutes() {
    this.router.post(`${this.path}`, this.signupCustomers);
  }

  public async signupCustomers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await userServices.signUp(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
}
