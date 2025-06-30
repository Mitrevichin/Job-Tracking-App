import { Router } from 'express';
import { checkForDemoUser } from '../middleware/authMiddleware.js';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js';
import {
  validateIdParam,
  validateJobInput,
} from '../middleware/validationMiddleware.js';

const router = Router();
/*
  Express goes top to bottom through your route and middleware definitions.
  Always define more specific routes before dynamic ones like /:id.
  Middleware and route handlers execute in the order you define them.
*/

router
  .route('/')
  .get(getAllJobs)
  .post(checkForDemoUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForDemoUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForDemoUser, validateIdParam, deleteJob);

export default router;
