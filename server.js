import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

let jobs = [
  { id: nanoid(), company: 'Apple', position: 'Front-end' },
  { id: nanoid(), company: 'Google', position: 'Back-end' },
];

dotenv.config();
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// const getData = async () => {
//   const res = await fetch(
//     'https://www.course-api.com/react-useReducer-cart-project'
//   );
//   const cartData = await res.json();
//   console.log(cartData);
// };
// getData();

app.post('/', (req, res) => {
  console.log(req);
  res.json({ message: 'Data received', data: req.body });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// GET ALL JOBS
app.get('/api/v1/jobs', (req, res) => {
  res.status(200).json({ jobs });
});

// CREATE JOB
app.post('/api/v1/jobs', (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Provide company and position' });
  }

  const id = nanoid(10);
  const job = { id, company, position };
  jobs.push(job);

  res.status(201).json({ job });
});

// GET SINGLE JOB
app.get('/api/v1/jobs/:id', (req, res) => {
  const { id } = req.params;

  const job = jobs.find(job => job.id === id);
  if (!job) {
    return res.status(404).json({ message: `No job with id ${id}` });
  }

  res.status(200).json({ job });
});

// EDIT JOB
app.patch('/api/v1/jobs/:id', (req, res) => {
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
});

// DELETE JOB
app.delete('/api/v1/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = jobs.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({ meessage: `No job with id ${id}` });
  }

  const newJobs = jobs.filter(job => job.id !== id);
  jobs = newJobs;

  res.status(200).json({ message: 'Job deleted' });
});

const port = process.env.PORT || 5100;

app.listen(5100, () => console.log(`server is running at port ${port}...`));
