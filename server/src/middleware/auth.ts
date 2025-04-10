import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.SECRET_KEY;
if (!secret_key) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

declare module 'express' {
  interface Request {
    user?: any;
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret_key);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
