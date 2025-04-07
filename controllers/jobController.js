import JobModel from '../models/JobModel.js';
import { nanoid } from 'nanoid';
import { NotFoundError } from '../errors/customErrors.js';

let jobs = [
  { id: nanoid(), company: 'Apple', position: 'Front-end' },
  { id: nanoid(), company: 'Google', position: 'Back-end' },
];

//GET ALL JOBS
export const getAllJobs = async (req, res) => {
  const jobs = await JobModel.find();
  res.status(200).json({ jobs });
};

// CREATE JOB
export const createJob = async (req, res) => {
  const { company, position } = req.body;
  const job = await JobModel.create({ company, position });
  res.status(201).json({ job });
};

// GET JOB
export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.findById(id);

  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }

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

  if (!updatedJob) {
    return res.status(404).json({ meessage: `No job with id ${id}` });
  }

  res.status(200).json({ message: 'Job modified', job: updatedJob });
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await JobModel.findByIdAndDelete(id);

  if (!removedJob) {
    return res.status(404).json({ meessage: `No job with id ${id}` });
  }

  res.status(200).json({ message: 'Job deleted', job: removedJob });
};
