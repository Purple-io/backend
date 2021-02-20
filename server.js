import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const database = process.env.DATABASE_URI;
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

// app.use('/');

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
