import { NextFunction, Request, Response } from 'express';
import responseUtils from '../../../shared/utils/response.utils';
import { API_KEY } from '../../../shared/configs/env.config';
import { getToken } from '../../../shared/utils/getToken.utils';
import { decodeToken } from '../utils/authTokens';
import UserRepo from '../../users/dataAccess';
import userModel from '../../users/models';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';
import { IRequest } from '../../../shared/types/req.types';

const userRepo = new UserRepo(userModel);
class AuthMiddlewares {
  constructor() {}
  public async verifyApiKey(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    const accessToken = headers['x-awrm-api-key'];
    if (!accessToken) {
      return responseUtils.badRequestResponse(
        res,
        'Access token is mandatory!'
      );
    }

    if (accessToken !== API_KEY) {
      return responseUtils.unauthorizedResponse(res, 'Invalid API Key');
    }
    next();
  }

  public async authenticate(req: IRequest, res: Response, next: NextFunction) {
    try {
      const token = getToken(req.headers.authorization as string);
      if (!token) {
        return res.status(403).json({
          messsage: 'Please provide authorization token',
          status: 'failure',
        });
      }

      const decoded: any = decodeToken(token);
      const foundUser = await userRepo.findById(decoded._id);
      if (!foundUser) {
        throw new HttpException(403, 'Invalid Token: User not Found');
      }

      req.user = foundUser;
      next();
    } catch (error: any) {
      return res.status(401).json({
        message: error?.message || 'Unauthorized: Unable to authenticate',
      });
    }
  }
}

export default new AuthMiddlewares();
