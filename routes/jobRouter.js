import { Router } from 'express';
import { checkForDemoUser } from '../middleware/authMiddleware.js';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import {
  validateIdParam,
  validateJobInput,
} from '../middleware/validationMiddleware.js';

const router = Router();

router
  .route('/')
  .get(getAllJobs)
  .post(checkForDemoUser, validateJobInput, createJob);
router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForDemoUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForDemoUser, validateIdParam, deleteJob);

export default router;
