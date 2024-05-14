import logger from '../../../shared/configs/logs.config';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';
import responseUtils from '../../../shared/utils/response.utils';
import UserRepo from '../../users/dataAccess';
import userModel from '../../users/models/';

import { ILogin } from '../types';

import bcrypt from '../../users/utils/bcrypt';
import { generateToken } from '../utils/authTokens';
import { BCRYPT_SALT } from '../../../shared/configs/env.config';
import { Types } from 'mongoose';

class AuthServices {
  private userRepo = new UserRepo(userModel);
  constructor() {}

  public async login(payload: ILogin) {
    let queryData = {
      filter: { email: payload.email },
      skip: 0,
      limit: 0,
    };
    const foundUser: any = await this.userRepo.findOne(queryData);
    if (!foundUser) {
      return new HttpException(404, 'User not found');
    }

    const passwordIsValid = await bcrypt.compare(
      payload.password,
      <string>foundUser.password
    );

    if (!passwordIsValid) {
      return new HttpException(400, 'Invalid Password');
    }
    const loginData: {
      _id: Types.ObjectId;
      email: string;
      firstName: string;
      lastName: string;
      accessToken?: string;
    } = {
      _id: foundUser._id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
    };

    const accessToken = generateToken(loginData);

    loginData.accessToken = accessToken;

    return responseUtils.buildResponse({
      data: loginData,
      message: 'Login Successful',
    });
  }
}

export default new AuthServices();
