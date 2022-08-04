import express from 'express';
import controllers from '../controllers/index';
import middlewares from '../middlewares/index';

const route = express.Router();

route.post('/addbills', [middlewares.validators.validateBillReqBody, middlewares.verifyUser],controllers.khataBook.addBills);
route.get('/bills', middlewares.verifyUser,controllers.khataBook.getBills);
route.put('/bills/:id', middlewares.verifyUser, controllers.khataBook.updateBill);
route.get('/bills/:user', middlewares.verifyUser,controllers.khataBook.getBillsOfBiller);
route.get('/bills/total/:date', middlewares.verifyUser, controllers.khataBook.getTotalAmountOfDate);

//Admin routes
route.get('/totalamount/:date', middlewares.verifyAdmin, controllers.khataBook.totalAmountOfUsers);
route.get('/totalamountofuser/:user', middlewares.verifyAdmin, controllers.khataBook.totalAmountOfUser);
route.get('/totalamountofparticularuser/:user', middlewares.verifyAdmin, controllers.khataBook.totalAmountOfParticularBiller)
 
export default route;