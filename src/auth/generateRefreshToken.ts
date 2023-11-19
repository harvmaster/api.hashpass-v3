import RefreshToken from "../models/refreshToken";
import jwt from 'jsonwebtoken';
import config from "../../config";

const jwt_refresh_secret = config.jwt_refresh_secret

export const generateRefreshToken = async (user: string): Promise<object> => {
  const refreshToken = jwt.sign({ userId: user }, jwt_refresh_secret);
  const token = new RefreshToken({
    token: refreshToken,
    user,
  });
  await token.save();
  return token;
}

export default generateRefreshToken