import mongoose from 'mongoose';

const dbConnection = async() => {
  try {
    await mongoose.connect(process.env.URI as string)
    console.log('connect')
  } catch (err){
    console.log(err);
    process.exit(1);
  }
}

export default dbConnection;