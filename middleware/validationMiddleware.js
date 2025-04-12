import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import JobModel from '../models/JobModel.js';

const withValidationErrors = validateValues => {
  // In Express if you want to return 2 middleware you can group them in an array
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('Company is required!'),
  body('position').notEmpty().withMessage('Position is required!'),
  body('jobLocation').notEmpty().withMessage('Job location is required!'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Invalid status value'),
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('Invalid type value'),
]);

// Validate that the ID is a valid MongoDB ObjectId and that a job with this ID exists in the database.
export const validateIdParam = withValidationErrors([
  param('id').custom(async value => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError('Invalid MongoDB id.');

    const job = await JobModel.findById(value);
    if (!job) {
      throw new NotFoundError(`No job with id ${value}`);
    }
  }),
]);
