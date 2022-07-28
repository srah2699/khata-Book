import billingBook from '../models/billing';
import {RequestHandler} from 'express';

const addBills: RequestHandler = async (req: any, res) => {
  const {bills} = req.body;
  const userBill: object[] = [];

  bills.forEach((bill: any) => 
  {
    bill['user'] = req.user._id
    if(bill['date']) bill['date'] = new Date(bill['date']).toISOString();
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
  let bills;
  try {
    bills = await billingBook.find({user: req.user._id});
  } catch (err) {
    res.status(500).send(err)
    return
  }
  res.status(200).send(bills);
}

const getBillsOfBiller: RequestHandler= async (req: any, res) => {
  let bills;
  let status: any = {};
  req.query.status === 'payable'? status['payable']= true : status['receivable'] = true;
  try {
    bills = await billingBook.aggregate([
      {$match: {"$and":[{billName: req.params.user}, status, {user: req.user._id}]}}
    ])
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
  const givenDate = new Date(req.params.date).toISOString();
  let key:any = [];
  req.query.status === 'payable' ? key = [{isPaid: false}, {payable:true}] : key = [{isReceived:false}, {receivable:true}];
  try {
    const amount = await billingBook.aggregate([
      {$match:{"$and":[...key, {user: req.user._id}]}} ,
      {$group: { _id: "$date" , totalAmount: {$sum: '$amount'} }}
    ])
    const total = amount.filter(value => value._id.toISOString().split('T')[0] === givenDate.split('T')[0])
    res.status(200).send(total);
  } catch (err) {
    res.status(500).send(err)
  }
}

const khataBook = {
  addBills,
  getBills,
  getBillsOfBiller,
  updateBill,
  getTotalAmountOfDate
}
export default khataBook;