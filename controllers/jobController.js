import JobModel from '../models/JobModel.js';
import mongoose from 'mongoose';
import day from 'dayjs';

//GET ALL JOBS
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType } = req.query;

  // Only provide jobs that belong to the specific user
  // You can filter by any field that exists in your schema model
  const queryObject = {
    createdBy: req.user.userId,
  };

  // Those attached properties must be some of the ones we have in our model
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const jobs = await JobModel.find(queryObject);
  res.status(200).json({ jobs });
};

// CREATE JOB
export const createJob = async (req, res) => {
  // Attach the logged-in user's ID to the job before saving.
  // This way, we can later fetch jobs that belong to this specific user (e.g., for dashboards or access control).
  // This way: The frontend doesn’t send or manipulate createdBy.The backend securely associates the job with the logged-in user.Later, when you fetch jobs, you can filter by createdBy to get only that user’s jobs.

  req.body.createdBy = req.user.userId;

  const { company, position, jobStatus, jobType, jobLocation } = req.body;

  const job = await JobModel.create({
    company,
    position,
    jobStatus,
    jobType,
    jobLocation,
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

  /*
    If you use .save(), you don’t need runValidators: true. It's only needed with update methods like:

   -findByIdAndUpdate
   -updateOne
   -findOneAndUpdate

   const job = await JobModel.findById(id);
   job.company = 'Amazon';
   await job.save(); // ✅ Always runs validation
  */
  const updatedJob = await JobModel.findByIdAndUpdate(id, updatedFields, {
    // Always use new: true and runValidators: true when doing findByIdAndUpdate, updateOne, findOneAndUpdate
    new: true, // Get updated doc instead of the original
    runValidators: true, // Enforce your schema rules on update
  });

  // This logic is moved in the validation middleware
  // if (!updatedJob) {
  //   return res.status(404).json({ message: `No job with id ${id}` });
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

// JOB STATS
export const showStats = async (req, res) => {
  let stats = await JobModel.aggregate([
    // req.user.userId is a string and has to be converted to ObjectId
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, cur) => {
    const { _id: title, count } = cur;
    acc[title] = count;
    return acc;
  }, {});

  console.log(stats);

  const defaultStats = {
    pending: stats.pending || 22,
    interview: stats.interview || 30,
    declined: stats.declined || 19,
  };

  let monthlyApplications = await JobModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map(item => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');

      return { date, count };
    })
    .reverse();

  res.status(200).json({ defaultStats, monthlyApplications });
};
