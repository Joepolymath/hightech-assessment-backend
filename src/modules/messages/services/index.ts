import { Types } from 'mongoose';
import messageModel from '../models';
import { IGetMessages, IMessage } from '../types';
import MessageRepo from '../dataAccess';
import responseUtils from '../../../shared/utils/response.utils';
import HttpException from '../../../shared/utils/exceptions/http.exceptions';

class MessageServices {
  private messageRepo = new MessageRepo(messageModel);
  constructor() {}

  public async create(payload: IMessage, userId: Types.ObjectId) {
    payload.user = userId;
    const newMessage = await this.messageRepo.create(payload);
    const savedMessage = await this.messageRepo.save(newMessage);
    return responseUtils.buildResponse({
      data: savedMessage,
      message: 'Message Sent',
    });
  }

  public async getOne(_id: Types.ObjectId) {
    let queryData = {
      filter: { _id },
      skip: 0,
      limit: 0,
    };
    const foundMessage = await this.messageRepo.findOne(queryData, [
      'user messageTo',
    ]);
    if (!foundMessage) {
      return new HttpException(404, 'Message not Found');
    }

    const updatedMessage = await this.messageRepo.findAndUpdate(
      { _id },
      { isRead: true },
      { new: true }
    );

    return responseUtils.buildResponse({
      data: foundMessage,
      message: 'Message Retrieved',
    });
  }

  public async getAll(query: IGetMessages, userId: Types.ObjectId) {
    const pagination = {
      skip: query.skip,
      limit: query.limit,
    };
    delete query.limit;
    delete query.skip;
    console.log({ query });

    let queryData = {
      filter: { ...query, messageTo: userId },
      skip: pagination.skip || 0,
      limit: pagination.limit || 0,
    };
    console.log(queryData);
    const foundMessages = await this.messageRepo.findAll(queryData, [
      'user messageTo',
    ]);

    if (!foundMessages) {
      return new HttpException(404, 'Messages not found');
    }
    queryData = {
      filter: { ...query, messageTo: userId, isRead: false },
      skip: pagination.skip || 0,
      limit: pagination.limit || 0,
    };
    const unreadMessages = await this.messageRepo.countDocs(queryData);
    return responseUtils.buildResponse({
      data: foundMessages,
      unreadMessages,
      totalMessages: foundMessages.length,
      message: 'Messages Retrieved',
    });
  }
}

export default new MessageServices();
