import JobModel from '../models/JobModel.js';
import UserModel from '../models/UserModel.js';

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(200).json({ user: userWithoutPassword });
};

// GET APPLICATION STATS
export const getApplicationStats = async (req, res) => {
  const users = await UserModel.countDocuments();
  const jobs = await JobModel.countDocuments();
  res.status(200).json({ users, jobs });
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const { name, email, lastName, location } = req.body; // Destructure fields you want to update

  const obj = { ...req.body };
  delete obj.password;

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.userId,
    { name, email, lastName, location } // Only include the fields you want to update
  );

  res.status(200).json({ message: 'User updated' });
};
