import UserModel from '../models/UserModel.js';

export const register = async (req, res) => {
  const isFirstAccount = (await UserModel.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const { name, email, password, lastName, location, role } = req.body;

  const user = await UserModel.create({
    name,
    email,
    password,
    lastName,
    location,
    role,
  });
  res.status(201).json(user);
};

export const login = async (req, res) => {
  res.send('Login');
};
