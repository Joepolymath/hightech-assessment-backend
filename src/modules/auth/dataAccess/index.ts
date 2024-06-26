import { Document, Model } from 'mongoose';
import DAL from '../../../shared/dataAccessLayer/dal';

export default class AuthOtpRepo<T extends Document> extends DAL<T> {
  constructor(model: Model<T>) {
    super(model);
  }
}
