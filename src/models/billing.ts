import mongoose from 'mongoose';

const khataBookSchema  = new mongoose.Schema({
  billName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  receivable: {
    type: Boolean
  },
  isReceived: {
    type: Boolean
  },  
  payable: {
    type: Boolean
  },
  isPaid: {
    type: Boolean
  },
  date: {
    type: Date, 
    default: new Date(Date.now())
  },
})

const khataBook = mongoose.model('khataBook', khataBookSchema);
export default khataBook;