import JobModel from '../models/JobModel.js';
import UserModel from '../models/UserModel.js';
import cloudinary from 'cloudinary';
import { formatImage } from '../middleware/multerMiddleware.js';

// GET CURRENT USER
/*
  ✅ getCurrentUser
Purpose:
Provides the currently logged-in user's data.

Why it’s common:
Most apps (dashboards, marketplaces, job boards, etc.) need to show who is logged in and personalize their experience.

Example usage:
When your frontend loads the dashboard, it might call /api/user/current-user to get the user's name, role, etc.

Pattern:
Requires authentication (i.e. the user has a token)
Returns user data (but never sensitive fields like password)

✅ Best practice: Don't rely on frontend storage for user info — always ask the backend!
*/
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
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);

    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.userId,
    newUser
  );

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(200).json({ msg: 'update user' });
};
