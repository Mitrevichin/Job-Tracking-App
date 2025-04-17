import jwt from 'jsonwebtoken';

export const createJWT = payload => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = token => {
  // Here after the decoding I will get what first is sent as a payload(id and role)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
