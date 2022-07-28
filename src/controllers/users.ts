import {RequestHandler} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const createUser: RequestHandler = async (req, res) => {
	const userDetails = new User(req.body);

	try {
		await userDetails.save();
		res.status(200).send('registered successfully');
	} catch (err: any) {
		res.status(500).send({ message: err.message });
	}
};

const signIn: RequestHandler = async (req, res, next) => {
	const { emailId, password } = req.body;

	const user: any = await User.findOne({ emailId }).select('+password');

	if (!user) {
		return res.status(400).send('User not found');
	}
	const isPasswordCorrect = await user.isValidatePassword(password);

	if (!isPasswordCorrect) return res.status(400).send('Password is Incorrect');
	const jwtToken = jwt.sign({ emailId: req.body.emailId }, 'skills-API', {
		expiresIn: '1h',
	});

	const options = {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	res.status(200).cookie('jwtToken', jwtToken, options).json({
		token: jwtToken,
	});
};

const logout: RequestHandler= (req, res) => {
	res.cookie('jwtToken', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		message: 'User Logged Out Successfully',
	});
};

const user = {
	createUser,
	signIn,
	logout,
};

export default user;
