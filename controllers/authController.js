import { UnauthenticatedError } from '../errors/customErrors.js';
import UserModel from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';

export const register = async (req, res) => {
  const isFirstAccount = (await UserModel.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const { name, email, password, lastName, location, role } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    lastName,
    location,
    role,
  });
  res.status(201).json({ message: 'User created' });
};

export const login = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) throw new UnauthenticatedError('Invalid credentials.');

  // We can compare the passwords only if there is such an user
  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect)
    throw new UnauthenticatedError('Invalid credentials.');

  res.send('Login');

  // Another SHORTER approach
  /*
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
    if (!isValidUser) throw new UnauthenticatedError('Invalid credentials.'); 
*/
};
