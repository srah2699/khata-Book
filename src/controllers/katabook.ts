/* 
The user can add the bills which are paid and received(cleared) ok
The user can add the bills which are payable and receivable(uncleared) ok
The user can get and edit the bills added ok
The user can check all the bills for a specific user cleared/cleared and that is payable/receivable ok
The user can check the total amt payable/receivable for a given dated  */ //ok

import billingBook from '../models/billing';
import {RequestHandler} from 'express';

const addBills: RequestHandler = async (req: any, res) => {
  const {bills} = req.body;
  const userBill: object[] = [];

  bills.forEach((bill: any) => 
  {
    // bill['user'] = req.user._id
    if(bill['date']) bill['date'] = new Date(bill['date']).setHours(0,0,0,0);
    userBill.push(bill);
  });
  
  try {
    await billingBook.insertMany(userBill);
    res.status(200).json({ message: 'bills added successfully',userBill});
  } catch (err: any) {
    res.status(500).send(err);
    return 
  }
}

const getBills: RequestHandler= async (req: any, res) => {
  // get bills of user get usr mail by decode jwt token req.user._id
  let bills;
  try {
    bills = await billingBook.find({user: req.headers.user})
  } catch (err) {
    res.status(500).send(err)
    return
  }
  res.status(200).send(bills);
}

const getBillsOfBiller: RequestHandler= async (req: any, res) => {
  let bills;
  try {
    bills = await billingBook.find({billName: req.params.user})
  } catch (err) {
    res.status(500).send(err)
    return
  }
  res.status(200).send(bills);
}

const updateBill: RequestHandler= async (req: any, res) => {
  const id = req.params.id;
  const update = req.body;
  try {
    const updatedBill = await billingBook.findByIdAndUpdate(id, update);
    res.status(200).send(`updated bill: ${updatedBill}`);
  } catch(err: any) {
    res.status(500).send(err);
  }
}

const getTotalAmountOfDate: RequestHandler= async (req: any, res) => {
  const givenDate = new Date(req.params.date).setHours(0,0,0,0);
  try {
    const amount = await billingBook.aggregate([
      {$match :{ $date: givenDate}},
      {$group: { _id: null , totalAmount: {$sum: '$amout'} }}
    ])
    res.status(200).send(amount);
  } catch (err) {
    res.status(500).send(err)
  }
}

const khataBook = {
  addBills,
  getBills,
  getBillsOfBiller,
  updateBill
}
export default khataBook;