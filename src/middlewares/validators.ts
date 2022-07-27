import {RequestHandler} from 'express';
import _ from 'lodash';

const validateUserReqBody: RequestHandler= (req, res, next) => {
  const keys = [
    'firstName',
    'lastName',
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
		typeof req.body.firstName !== 'string' ||
		typeof req.body.lastName !== 'string' ||
		typeof req.body.emailId !== 'string' ||
		typeof req.body.password !== 'string'
	) {
		return res.status(400).send(`name, emailId and password must be strings`);
	}

  next();
}

const validateSkillReqBody: RequestHandler= (req, res, next) => {
  const skills = req.body.skills;
  const errors: string[] = [];
  skills.forEach((skill: any, index: number) => {
    const keys = [
      'name',
      'isExpert',
      'proficiency',
      'experience',
      'level',
    ];
    const unknownKeys = _.difference(_.keys(skill), keys);

    if(unknownKeys.length){
      errors.push(`unexpected properties ${index}: ${unknownKeys}`);
    }

    const missingKeys = _.difference(keys, _.keys(skill));
    if(missingKeys.length){
      errors.push(`Missing required properties ${index}: ${missingKeys}`);
    }
  })

  errors.length?res.status(400).send(errors):next();
}

const validators = {
  validateUserReqBody,
  validateSkillReqBody,
}

export default validators
