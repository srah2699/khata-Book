import {RequestHandler} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const checkUser: RequestHandler= async (req, res, next) => {
  const { emailId } = req.body;
  try { 
    await User.findOne({emailId}) ? res.status(400).send({ message: 'User already exists'}) : next()
  } catch (err) {
    res.status(404).send(err);
  }
}

const verifyUser: RequestHandler= async (req: any, res, next) => {
  let token = req.cookies.jwtToken;

  if (!token && req.header("Authorization")) {
    const bearerToken: string | any = req.header("Authorization");
    token = bearerToken.replace("Bearer ", "");
  }

  if(!token) {
    return res.status(400).send('Not authorized, no token');
  }
  
  try {
    const secretKey: any = process.env.SECRET_KEY;
    const decodedToken: any = jwt.verify(token, secretKey);
    req.user=await User.findOne({emailId: decodedToken.emailId });
    next();
  } catch (err: any){
    res.status(500).send({ message: err.message})
  }
}

export {checkUser, verifyUser}