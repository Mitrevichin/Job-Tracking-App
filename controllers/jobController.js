import JobModel from '../models/JobModel.js';
import mongoose from 'mongoose';
import day from 'dayjs';

//GET ALL JOBS (SEARCH, SORT, PAGINATION)
export const getAllJobs = async (req, res) => {
  // Destructure query parameters from the URL
  const { search, jobStatus, jobType, sort } = req.query;

  // Initialize a query object to filter jobs in the database
  // Only fetch jobs created by the currently logged-in user
  const queryObject = {
    createdBy: req.user.userId, // `req.user.userId` comes from the auth middleware
  };

  // If there's a search term, search for it in the "position" or "company" fields
  if (search) {
    // This line assigns a new property to queryObject:
    queryObject.$or = [
      // Case-insensitive regex search on "position"
      { position: { $regex: search, $options: 'i' } },
      // Case-insensitive regex search on "company"
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  // If jobStatus is selected and it's not "all", filter by that specific status
  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  // If jobType is selected and it's not "all", filter by that type
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // Define sorting options (how we want to order the jobs)
  const sortOptions = {
    newest: '-createdAt', // descending order by creation date
    oldest: 'createdAt', // ascending order by creation date
    'a-z': 'position', // ascending order alphabetically by position
    'z-a': '-position', // descending order alphabetically by position
  };

  // Pick the actual sort key based on the user’s input (or default to 'newest')
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Setup Pagination
  const page = Number(req.query.page || 1);
  // The limit is not gonna be passed with the Front-end and the default 10 will be used every time
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit; // Number of jobs to skip before starting current page

  // Use Mongoose to find the jobs that match the queryObject and sort them
  const jobs = await JobModel.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  // You can use countDocuments with a filter (query) or without one.
  const totalJobs = await JobModel.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  // Return the jobs in JSON format with HTTP status 200 (OK)
  res.status(200).json({ totalJobs, numOfPages, currentPage: page, jobs });
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
