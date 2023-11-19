import mongoose, { Document, Model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const jwt_refresh_secret = config.jwt_refresh_secret;

interface IRefreshToken {
  token: string;
  user: mongoose.Schema.Types.ObjectId;
  revoked: boolean;
  create_date: Date;
}

interface IRefreshTokenDocument extends IRefreshToken, Document {
  toAuthJSON: () => IRefreshToken;
}

interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {
  generateRefreshToken: (user: mongoose.Schema.Types.ObjectId) => Promise<IRefreshTokenDocument>;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument, IRefreshTokenModel>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

RefreshTokenSchema.methods.toAuthJSON = function (): IRefreshToken {
  return {
    token: this.token,
    user: this.user,
    revoked: this.revoked,
    create_date: this.create_date,
  };
};

RefreshTokenSchema.statics.generateRefreshToken = async function (user: mongoose.Schema.Types.ObjectId) {
  const refreshToken = jwt.sign({ userId: user }, jwt_refresh_secret);
  const token = new this({
    token: refreshToken,
    user,
  });
  await token.save();
  return token;
};

const RefreshToken = mongoose.model<IRefreshTokenDocument, IRefreshTokenModel>('RefreshToken', RefreshTokenSchema);

export { RefreshToken };
export default RefreshToken;
