import JobModel from '../models/JobModel.js';
import UserModel from '../models/UserModel.js';

export const getCurrentUser = (req, res) => {
  res.status(200).json({ message: 'Get current user' });
};

export const getApplicationStats = (req, res) => {
  res.status(200).json({ message: 'Application stats' });
};

export const updateUser = (req, res) => {
  res.status(200).json({ message: 'Update user' });
};
