import express, {Application} from 'express';
import routes from './routes/index';
import dbConnection from './configs/db';
const dotenv = require('dotenv').config();
export const app: Application = express();
import cookieParser from 'cookie-parser';


app.use(express.json());
app.use(cookieParser());

async function main() {
  await dbConnection();

  app.get('/livecheck', (req, res) => {
    res.send('working');
  })

  app.use('/api/v1', [routes.khataBook, routes.users])
}

main();
