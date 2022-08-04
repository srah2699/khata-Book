import billingBook from '../models/billing';
import {RequestHandler} from 'express';
import user from '../models/user';
import mongoose from 'mongoose';

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

const totalAmountOfUsers: RequestHandler= async (req: any, res) => {
  const date = new Date(req.params.date).toISOString();
  let payData:any = [];
  if(req.query.payValue === 'payable' && req.query.status === 'true') payData = [{isPaid: true}, {payable:true}]
  if(req.query.payValue === 'payable' && req.query.status === 'false') payData = [{isPaid: false}, {payable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'true') payData = [{isReceived: true}, {receivable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'false') payData = [{isReceived: false}, {receivable:true}]
 
  try{
    const data = await billingBook.aggregate([
      {
        $match: { "$and" : [ ...payData ] }
      } ,
      {
        $group: { _id: "$date" , totalAmount: { $sum: "$amount"}}
      }
    ])
    const result = data.filter(value => value._id.toISOString().split('T')[0] === date.split('T')[0])
    res.status(200).send(result);
  } catch (err){
    res.status(500).send(err);
  }
}

const totalAmountOfUser: RequestHandler= async (req: any, res) => {
  const date = new Date(req.query.date).toISOString();
  const userid = req.params.user;

  let payData:any = [];
  if(req.query.payValue === 'payable' && req.query.status === 'true') payData = [{isPaid: true}, {payable:true}]
  if(req.query.payValue === 'payable' && req.query.status === 'false') payData = [{isPaid: false}, {payable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'true') payData = [{isReceived: true}, {receivable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'false') payData = [{isReceived: false}, {receivable:true}]
  
  try{
    const data: any = await user.aggregate([
      {
        $match: { $expr: { $eq: ['$_id' , { $toObjectId: userid }]}}
      },
      {
        $lookup: 
        {
          from: "khatabooks",
          let: { userId: "$_id"},
          pipeline: [
            {
              $match: { "$and": [...payData]}
            },
            {
              $match: 
              { $expr : 
                { "$and" : [ 
                  //{ $eq: [ "$user" , { $toObjectId: userid } ] } ,
                  { $eq: [ "$user",  "$$userId" ] },
                  //...payData
                ] }
              } 
          },
          {
            $group: { _id: "$date" , totalAmount: { $sum: "$amount"}}
          },
          ],
          as: "userData"
        }
      }
    ]);
    const resultsByDates = data[0].userData;
    const result = resultsByDates.filter(result => result._id.toISOString().split('T')[0] === date.split('T')[0])
    res.status(200).send(result);

  } catch (err) {
    res.status(500).send(err)
  }
}

const totalAmountOfParticularBiller: RequestHandler= async (req: any, res) => {
  const userid = req.params.user;
  const biller = req.query.biller;
  const date = req.query.date || null;

  let payData:any = [];
  if(req.query.payValue === 'payable' && req.query.status === 'true') payData = [{isPaid: true}, {payable:true}]
  if(req.query.payValue === 'payable' && req.query.status === 'false') payData = [{isPaid: false}, {payable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'true') payData = [{isReceived: true}, {receivable:true}]
  if(req.query.payValue === 'receivable' && req.query.status === 'false') payData = [{isReceived: false}, {receivable:true}]

  const data = await user.aggregate([
    {
      $match: { $expr: { $eq: ['$_id' , { $toObjectId: userid }]}}
    },
    {
      $lookup: { 
        from: "khatabooks",
        let : { userId: "$_id" },
        pipeline: [
          {
            $match: { "$and": [ {billName: biller}, ...payData]}
          },
          {
            $match: { $expr: { $eq: ['$user' , '$$userId']}}
          },
        ],
        as: "userBillerData"
      }
    }
  ])
  const resultsByDates = data[0].userBillerData;
  if(date){
    const result = resultsByDates.filter(result => result.date.toISOString().split('T')[0] === date.split('T')[0])
    return res.status(200).send(result);
  }
  res.status(200).send(resultsByDates);
}
const khataBook = {
  addBills,
  getBills,
  getBillsOfBiller,
  updateBill,
  getTotalAmountOfDate,
  totalAmountOfUsers,
  totalAmountOfUser,
  totalAmountOfParticularBiller
}
export default khataBook;

//var ObjectId = require('mongodb').ObjectId;
  //const user = new mongoose.Types.ObjectId(req.body.user)
  //console.log(user)
  /* const data = await billingBook.aggregate([
    {
      $match: {"$and": [...payData]}
    },
    {
      $lookup: 
      {
        from: "khatausers",
        let: { userI: "$user"},
        pipeline: [
          {
            $match: 
            { $expr : 
              { "$and" : [ 
                { $eq: [ '$_id' , { $toObjectId: userid } ] } ,
                { $eq: [ "$_id",  "$$userI" ] },
                //...payData
              ] }
            } 
         }
        ],
        as: "userData"
      }
    }, 
    {
      $group: { _id: "$date" , totalAmount: { $sum: "$amount"}}
    } 
  ])  */
  /* const data = await billingBook.aggregate([
    {
      $match: { $expr : { $eq: [ '$user' , { $toObjectId: userid } ] } } 
    }
  ]) */