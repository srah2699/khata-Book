import {RequestHandler} from 'express';
import _ from 'lodash';

const validateUserReqBody: RequestHandler= (req, res, next) => {
  const keys = [
    'Name',
    'emailId',
    'password',
    'phone',
  ];
  const unknownKeys = _.difference(_.keys(req.body), keys);

  keys.pop();
  if(unknownKeys.length){
    return res.status(400).send(`unexpected properties: ${unknownKeys}`);
  }

  const missingKeys = _.difference(keys, _.keys(req.body));
  if(missingKeys.length){
    return res.status(400).send(`Missing required properties: ${missingKeys}`);
  }

  if (
		typeof req.body.emailId !== 'string' ||
		typeof req.body.password !== 'string'
	) {
		return res.status(400).send(`name, emailId and password must be strings`);
	}

  next();
}

const validateBillReqBody: RequestHandler= (req, res, next) => {
  const {bills} = req.body;
  const errors: string[] = [];
  bills.forEach((bill: any, index: number) => {
    const keys = [
      'billName',
      'amount',
      'receivable',
      'payable',
    ];

    const missingKeys = _.difference(keys, _.keys(bill));
    if(missingKeys.length){
      errors.push(`Missing required properties ${index}: ${missingKeys}`);
    }
  })

  errors.length?res.status(400).send(errors):next();
}

const validators = {
  validateUserReqBody,
  validateBillReqBody,
}

export default validators
