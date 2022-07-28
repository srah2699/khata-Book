import express from 'express';
import User from '../models/user';
import middlewares from '../middlewares/index';
import controllers from '../controllers/index';

const user = express.Router();

user.post(
	'/register',
	[middlewares.validators.validateUserReqBody, middlewares.checkUser],
	controllers.user.createUser
);
user.post('/login', controllers.user.signIn);
user.get('/logout', controllers.user.logout);
user.put('/resetPassword',controllers.user.resetPassword);
user.put('/accountstatus',controllers.user.accountStatus);

export default user;
