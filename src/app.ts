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
/*   
  The user can add the bills which are paid and received(cleared)
  The user can add the bills which are payable and receivable(uncleared)
  The user can get and edit the bills added
  The user can check all the bills for a specific user cleared/cleared and that is payable/receivable
  The user can check the total amt payable/receivable for a given dated 


userSchema : {

}


billSchema : {
  userId:
  billName:
  amount:
  receivable:
  isReceived:  
  payable:
  isPaid: 
  date: 
}

pay: {
  billId:
  isPaid:
}

receive : {
  billId:
  isReceived:
}
*/