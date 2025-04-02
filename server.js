import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

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

const port = process.env.PORT || 5100;

app.listen(5100, () => console.log(`server is running at port ${port}...`));
