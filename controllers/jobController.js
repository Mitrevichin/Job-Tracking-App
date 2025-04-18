import JobModel from '../models/JobModel.js';

//GET ALL JOBS
export const getAllJobs = async (req, res) => {
  // Only provide jobs that belong to the specific user
  // You can filter by any field that exists in your schema
  const jobs = await JobModel.find({ createdBy: req.user.userId });
  res.status(200).json({ jobs });
};

// CREATE JOB
export const createJob = async (req, res) => {
  // Attach the logged-in user's ID to the job before saving.
  // This way, we can later fetch jobs that belong to this specific user (e.g., for dashboards or access control).
  req.body.createdBy = req.user.userId;

  const { company, position } = req.body;
  const job = await JobModel.create({
    company,
    position,
    createdBy: req.user.userId,
  });
  res.status(201).json({ job });
};

// GET JOB
export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.findById(id);

  // This logic is moved in the validation middleware
  // if (!job) {
  //   throw new NotFoundError(`No job with id ${id}`);
  // }

  res.status(200).json({ job });
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, position, jobStatus, jobType, jobLocation } = req.body;

  const updatedFields = { company, position, jobStatus, jobType, jobLocation };

  const updatedJob = await JobModel.findByIdAndUpdate(id, updatedFields, {
    // Always use new: true and runValidators: true when doing findByIdAndUpdate, updateOne, findOneAndUpdate
    new: true, // Get updated doc instead of the original
    runValidators: true, // Enforce your schema rules on update
  });

  // This logic is moved in the validation middleware
  // if (!updatedJob) {
  //   return res.status(404).json({ meessage: `No job with id ${id}` });
  // }

  res.status(200).json({ message: 'Job modified', job: updatedJob });
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await JobModel.findByIdAndDelete(id);

  // This logic is moved in the validation middleware
  // if (!removedJob) {
  //   return res.status(404).json({ meessage: `No job with id ${id}` });
  // }

  res.status(200).json({ message: 'Job deleted', job: removedJob });
};
