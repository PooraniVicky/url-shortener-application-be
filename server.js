import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import User from './Routes/user.js'
import Url from './Routes/url.js'
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors({ 
  origin: 'https://url-shortener-app-poorani.netlify.app',
  credentials: true 
}));

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/user', User); 
app.use('/url', Url); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log("Error connecting to MongoDB", error);
  });

export default app;
