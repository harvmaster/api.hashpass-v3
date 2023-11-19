import mongoose, { Document, Model, Schema, Types } from 'mongoose'
import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import config from '../../../config'

const pbkdf2Async = promisify(pbkdf2);

const jwt_secret = config.jwt_secret

export interface IUserSettings {
  algorithm: string;
}

export interface IUser {
  username: string;
  password?: string;
  salt?: string;
  settings: IUserSettings;
  create_date: Date;
}

interface IUserDocument extends IUser, Document {
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
  toAuthJSON(): IUser & { _id: Types.ObjectId };
  generateToken(): string;
}

interface IUserModel extends Model<IUserDocument> {}

const UserSchema: Schema<IUserDocument> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
  },
  settings: {
    type: Object,
    default: {
      algorithm: 'hp2',
    }
  },
  create_date: {
    type: Date,
    default: Date.now,
  }
})

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  const hash = await pbkdf2Async(password, this.salt!, 10000, 512, 'sha512').then(buffer => buffer.toString('hex'));
  return this.password === hash;
}

UserSchema.methods.setPassword = async function (password: string): Promise<void> {
  this.salt = randomBytes(16).toString('hex');
  this.password = await pbkdf2Async(password, this.salt, 10000, 512, 'sha512').then(buffer => buffer.toString('hex'));
}

UserSchema.methods.toAuthJSON = function (): Omit<IUser & { _id: Types.ObjectId }, 'password' | 'salt'> {
  const { password, salt, ...userWithoutPassword } = this;
  return userWithoutPassword;
}

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema)

export default User;
