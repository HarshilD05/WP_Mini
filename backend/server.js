const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');



connectDB();

const app = express();

app.use(helmet()); // sec
app.use(cors({ origin: process.env.FRONTEND_URL })); // cors
app.use(morgan('dev')); // log
app.use(express.json()); // body parsee
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'ApproveFlow API', 
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});