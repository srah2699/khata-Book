import {RequestHandler} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
	const secretKey: any = process.env.SECRET_KEY;
	if (!isPasswordCorrect) return res.status(400).send('Password is Incorrect');
	if(user.disable) return res.status(400).send('User disabled');
	const jwtToken = jwt.sign({ emailId: req.body.emailId }, secretKey, {
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

const resetPassword: RequestHandler= async (req, res) => {
	const { emailId, password, newPassword} = req.body;

	const user: any = await User.findOne({ emailId }).select('+password');

	if (!user) {
		return res.status(400).send('User not found');
	}
	const isPasswordCorrect = await user.isValidatePassword(password);

	if (!isPasswordCorrect) return res.status(400).send('Password is Incorrect');
	const updatedPassword = await bcrypt.hash(newPassword, 10)
	try{
	const updatedUser = await User.updateOne({emailId}, { $set: {password: updatedPassword}})
	} catch (err) {
		res.status(500).send(err)
	}
	res.status(200).send('password updated')
}

const accountStatus: RequestHandler= async (req: any, res) => {
	const { emailId, password, disable} = req.body;

	const user: any = await User.findOne({ emailId }).select('+password');

	if (!user) {
		return res.status(400).send('User not found');
	}
	const isPasswordCorrect = await user.isValidatePassword(password);

	if (!isPasswordCorrect) return res.status(400).send('Password is Incorrect');
	try{
		const updatedUser = await User.updateOne({emailId}, { $set: {disable}})
		} catch (err) {
			res.status(500).send(err)
	}
	res.status(200).send('account disabled');
}

const user = {
	createUser,
	signIn,
	logout,
	resetPassword,
	accountStatus
};

export default user;
