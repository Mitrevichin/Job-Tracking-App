import { UnauthenticatedError } from '../errors/customErrors.js';
import UserModel from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';

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

  // Another SHORTER approach
  /*
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
    if (!isValidUser) throw new UnauthenticatedError('Invalid credentials.'); 
*/

  /* 
  JWT can be sent to the client either in the response body (easy to use with localStorage) or as an httpOnly cookie (more secure against XSS); choose based on your app’s needs.Generate and send JWT after login (auth confirmed). 
  Optionally send it after registration if auto-login is desired.
  */
  const token = createJWT({ userId: user._id, role: user.role });

  const oneDayInMlSec = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDayInMlSec),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'User logged in' });

  // res.json({ token });
};
