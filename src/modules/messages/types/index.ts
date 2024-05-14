import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  user: Types.ObjectId;
  subject: string;
  content: string;
  isRead: boolean;
  messageTo: Types.ObjectId;
}

export interface IGetMessages {
  user: Types.ObjectId;
  isRead: boolean;
  skip?: number;
  limit?: number;
  messageTo?: Types.ObjectId;
}
