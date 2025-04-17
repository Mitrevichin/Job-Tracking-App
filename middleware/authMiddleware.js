import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  // This is our cookie that we created and name 'token'. It can be accessed via the cookieParser middleware with req.cookies
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('Authentication invalid');

  try {
    const { userId, role } = verifyJWT(token);
    /*
      We extract userId and role from the verified JWT and attach them to req.user.
      This allows all subsequent middleware and route handlers to easily access the user's identity and permissions.
      For example, we can later check req.user.role to authorize access to admin-only routes.
     */
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};
