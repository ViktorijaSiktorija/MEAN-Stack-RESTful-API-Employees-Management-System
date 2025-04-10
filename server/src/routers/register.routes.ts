import * as express from 'express';
import { collections } from '../database';
import bcrypt from 'bcrypt';

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post('/', async (req, res) => {
  try {
    const user = req.body;

    const password = req.body.password;
    const saltRounds = 10;
    const hashed_pass = await bcrypt.hash(password, saltRounds);
    const newUser = { ...user, password: hashed_pass };
    const existingUser = await collections?.users?.findOne({
      email: user.email,
    });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    const result = await collections?.users?.insertOne(newUser);

    if (result?.acknowledged) {
      res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
    } else {
      res.status(500).json({ error: 'Failed to create a new user.' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});
