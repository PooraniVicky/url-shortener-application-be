import User from '../Models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import express from 'express';



dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pooranidemotask@gmail.com',
    pass: 'qyqelftjsokhfhtl',
  },
});


export const signup = async (req, res) => {
  const { username, email, password, repeatPassword } = req.body;

  if (password !== repeatPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const activationToken = jwt.sign({ email }, 'secret', { expiresIn: '1d' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, repeatPassword: hashedPassword, activationToken });

    await newUser.save();
    const url = `http://localhost:5173/activate/${activationToken}`;
    transporter.sendMail({
      to: email,
      subject: 'Activate your account',
      html: `Click <a href="${url}">here</a> to activate your account.`
    });

    res.status(201).json({ message: 'User registered. Please check your email to activate your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};



  // Activate User Account
  
export const activateUser = async (req, res) => {
  const { token } = req.params;
  
    try {
      // console.log('Received token:', token);
      const decoded = jwt.verify(token, 'secret');
      // console.log('Decoded token:', decoded);
      const user = await User.findOne({ email: decoded.email });
  
      if (!user || user.activationToken !== token) {
        return res.status(400).json({ message: 'Invalid token.' });
      }
  
      if (user.isActive) {
        return res.status(200).json({ message: 'Account is already activated.' });
      }
  
      user.isActive = true;
      user.activationToken = undefined;
  
      await user.save();
      res.status(200).json({ message: 'Account activated successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };

//login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // console.log(isPasswordCorrect)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username });

  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
//forgot password
export const forgotPassword = async(req,res)=>{
const { email } = req.body;

try {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  const resetToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  user.resetToken = resetToken;

  await user.save();

  const url = `http://localhost:5173/reset-password/${resetToken}`;
  transporter.sendMail({
    to: email,
    subject: 'Reset your password',
    html: `Click <a href="${url}">here</a> to reset your password.`
  });

  res.status(200).json({ message: 'Password reset link sent to your email.' });
} catch (err) {
  res.status(500).json({ message: 'Something went wrong.' });
}
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: decoded.id, resetToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};