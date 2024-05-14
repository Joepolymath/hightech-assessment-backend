import { Request } from 'express';
import { IUser } from '../../modules/users/types';
export interface IRequest extends Request {
  userIpAddress?: string;
  user?: IUser;
}
