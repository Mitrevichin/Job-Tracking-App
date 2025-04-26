import JobModel from '../models/JobModel.js';
import UserModel from '../models/UserModel.js';

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
  const { name, email, lastName, location } = req.body; // Destructure fields you want to update

  /*
    The purpose of using the rest/spread operator is to create a shallow copy of req.body. Good practice: don't modify the request object if you don't need to. If something else later in your code (or another middleware) relies on req.body, it won't be affected.
  */
  const obj = { ...req.body };
  delete obj.password;

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.userId,
    { name, email, lastName, location } // Only include the fields you want to update
  );

  res.status(200).json({ message: 'User updated' });
};
