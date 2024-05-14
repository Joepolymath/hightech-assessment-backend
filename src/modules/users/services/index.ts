import { Types } from 'mongoose';
import { BCRYPT_SALT } from '../../../shared/configs/env.config';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';
import responseUtils from '../../../shared/utils/response.utils';
import UserRepo from '../dataAccess';
import userModel from '../models';
import { IUser as IUserLoc } from '../types';
import bcrypt from '../utils/bcrypt';

class UsersServices {
  private userRepo = new UserRepo(userModel);
  constructor() {}

  public async signUp(payload: IUserLoc) {
    const foundUser = await this.userRepo.findOne({ email: payload.email });

    if (foundUser) {
      return new HttpException(400, 'Email exists');
    }

    const hashSalt = await bcrypt.generateSalt(Number(BCRYPT_SALT));
    payload.password = await bcrypt.hashPassword(
      <string>payload.password,
      hashSalt
    );

    const newUser = await this.userRepo.create(payload);
    const savedUser = await this.userRepo.save(newUser);

    return responseUtils.buildResponse({
      data: savedUser,
      message: 'SignUp Successful',
    });
  }
}

export default new UsersServices();
