import express, {Application} from 'express';
import routes from './routes/index';
import dbConnection from './configs/db';
const dotenv = require('dotenv').config();
export const app: Application = express();

app.use(express.json());

async function main() {
  await dbConnection();

  app.get('/livecheck/', (req, res) => {
    console.log(req.query.test);
    res.send('working');
  })

  app.use('/api/v1', [routes.khataBook, routes.users])
}

main();
