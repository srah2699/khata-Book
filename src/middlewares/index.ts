import { checkUser, verifyUser, verifyAdmin } from './auth';
import validators from './validators';

const middlewares = {
  checkUser,
  verifyUser,
  verifyAdmin,
  validators
}

export default middlewares;