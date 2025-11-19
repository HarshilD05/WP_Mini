const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');


connectDB();

const app = express();

app.use(helmet()); // sec
app.use(cors({ origin: "*"})); // cors
app.use(morgan('dev')); // log
app.use(express.json()); // body parsee
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'ApproveFlow API', 
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/getHomePage', (req,res)=>{
    res.json({
        message:"Welcome to ApproveFlow"
    });
});

app.post('/login', (req,res)=>{
    const username = req.body.username;

    jwt.sign()
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});