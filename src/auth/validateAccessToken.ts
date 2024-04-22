import jwt from 'jsonwebtoken';
import config from '../../config'
import { NextFunction, Request, Response } from 'express';

const jwt_secret = config.jwt_secret

export const validateAccessToken = (req: Request, res: Response, next: NextFunction): string | object | boolean => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token is required' });

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) return res.status(400).json({ error: 'Invalid token' });
    // @ts-ignore
    req.user = user.id;
    next();
  });
}

export default validateAccessToken