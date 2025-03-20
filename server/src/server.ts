import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDatabasee } from './database';
import error from 'console';
import { employeeRouter } from './employee.routes';

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    'No ATLAS_URI environment variable has been defined in config.env'
  );
  process.exit(1);
}

connectToDatabasee(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use('/employees', employeeRouter);
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));
