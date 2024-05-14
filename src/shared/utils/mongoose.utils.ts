import mongoose from 'mongoose';

export function stringToObjectId(str: string): mongoose.Types.ObjectId {
  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(str);
    return objectId;
  } catch (error) {
    console.error('Error converting string to ObjectId:', error);
    throw error;
  }
}
