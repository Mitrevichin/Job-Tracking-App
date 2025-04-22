import {
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js';
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
      Once a user is authenticated (e.g., via JWT), their identity and role/permissions are attached to the request context — so that other parts of the app can access it easily.
     */
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

/*
If you didn’t need to pass parameters, you could write middleware like this:

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new UnauthorizedError('Not allowed');
  }
  next();
};

router.get('/admin/app-stats', isAdmin, getApplicationStats);


No need to “invoke” it here — because isAdmin is already a plain middleware function.
So why do we invoke it like authorizePermissions('admin')?
Because:
 You want the middleware to be dynamic.
 You want to reuse it for different roles.
*/
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorize to access this route');
    }
    next();
  };
};
