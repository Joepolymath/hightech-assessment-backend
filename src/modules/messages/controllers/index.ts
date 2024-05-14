import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../shared/types/controllers.types';
import messagesServices from '../services';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';
import { IRequest } from '../../../shared/types/req.types';
import { IGetMessages } from '../types';
import { Types } from 'mongoose';
import middlewaresInstance from '../../auth/middlewares';

export default class MessageController implements Controller {
  public readonly path: string = '/messages';
  public readonly router: Router = Router();
  private middlewares = middlewaresInstance;

  constructor() {
    this.loadRoutes();
  }

  private loadRoutes() {
    this.router.post(
      `${this.path}`,
      this.middlewares.authenticate,
      this.create
    );
    this.router.get(`${this.path}`, this.middlewares.authenticate, this.getAll);
    this.router.get(
      `${this.path}/getOne`,
      this.middlewares.authenticate,
      this.getOne
    );
  }

  public async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpException(403, 'Requesting User Missing');
      }
      const data = await messagesServices.create(req.body, req.user._id);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
  public async getAll(req: IRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpException(403, 'Requesting User Missing');
      }
      const data = await messagesServices.getAll(
        req.query as unknown as IGetMessages,
        req.user._id
      );
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
  public async getOne(req: IRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpException(403, 'Requesting User Missing');
      }
      const data = await messagesServices.getOne(
        req.query._id as unknown as Types.ObjectId
      );
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
}
