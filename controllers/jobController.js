import JobModel from '../models/JobModel.js';
import { nanoid } from 'nanoid';

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
    return res.status(404).json({ message: `No job with id ${id}` });
  }

  res.status(200).json({ job });
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Provide company and position' });
  }

  const { id } = req.params;
  const job = jobs.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({ meessage: `No job with id ${id}` });
  }

  job.company = company;
  job.position = position;

  res.status(200).json({ message: 'Job modified', job });
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = jobs.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({ meessage: `No job with id ${id}` });
  }

  const newJobs = jobs.filter(job => job.id !== id);
  jobs = newJobs;

  res.status(200).json({ message: 'Job deleted' });
};
