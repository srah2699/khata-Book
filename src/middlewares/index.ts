import { checkUser, verifyUser } from './auth';
import validators from './validators';

const middlewares = {
  checkUser,
  verifyUser,
  validators
}

export default middlewares;