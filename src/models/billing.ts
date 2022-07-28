import mongoose from 'mongoose';
import User from './user';

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
    type: Boolean,
    required: true
  },
  isReceived: {
    type: Boolean,
    default: false
  },  
  payable: {
    type: Boolean,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date, 
    default: new Date(Date.now()).toISOString()
  },
  user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
})

const billingBook = mongoose.model('KhataBook', khataBookSchema);

export default billingBook;