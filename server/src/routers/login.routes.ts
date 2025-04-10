import * as express from 'express';
import { collections } from '../database';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const secret_key = process.env.SECRET_KEY;
if (!secret_key) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

export const login = express.Router();
login.use(express.json());

login.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await collections?.users?.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Provided Password:', password);
    console.log('Hashed Password from DB:', user.password);
    const token = jwt.sign({ id: user._id, email: user.email }, secret_key, {
      expiresIn: '1h',
    });

    if (isMatch) {
      res.status(200).json({ token });
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});
