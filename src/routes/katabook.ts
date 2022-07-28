import express from 'express';
import controllers from '../controllers/index';
const route = express.Router();
/* 
The user can add the bills which are paid and received(cleared) ok
The user can add the bills which are payable and receivable(uncleared) ok
The user can get and edit the bills added ok
The user can check all the bills for a specific user cleared/cleared and that is payable/receivable ok
The user can check the total amt payable/receivable for a given dated  */ //ok
route.post('/addbills', controllers.khataBook.addBills);
route.get('/bills', controllers.khataBook.getBills);
route.put('/bills/:id', controllers.khataBook.updateBill);
route.get('/bills/:user', controllers.khataBook.getBillsOfBiller);
route.get('/bills/total')

export default route;