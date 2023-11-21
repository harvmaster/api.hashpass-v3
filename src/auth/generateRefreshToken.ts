import RefreshToken, { IRefreshTokenDocument } from "../models/refreshToken";
import jwt from 'jsonwebtoken';
import config from "../../config";

const jwt_refresh_secret = config.jwt_secret

export const generateRefreshToken = async (user: string): Promise<IRefreshTokenDocument> => {
  const random = Math.random() * 100000
  const refreshToken = jwt.sign({ userId: user, random }, jwt_refresh_secret);
  const token = new RefreshToken({
    token: refreshToken,
    user,
  });
  await token.save();
  return token;
}

export default generateRefreshToken