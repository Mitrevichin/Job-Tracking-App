export const authenticateUser = (req, res, next) => {
    console.log('auth middleware')
    next();
};
