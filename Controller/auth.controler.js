const User = require('../Models/users.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mailing_system = require('../Mail/mailServices.js');

const nodemailer = require('nodemailer');
const OTP_EXPIRATION_TIME = 10 * 60 * 1000;

require("dotenv").config();

const Registration = async (req, res) => {
     try {
          const { emailID, password } = req.body;

          if (!emailID || !password) {
               return res.status(400).json({
                    status: 400,
                    error: 'All fields (email, password) are required.',
               });
          }
          const existingUser = await User.findOne({ emailID });
          if (existingUser) {
               return res.status(400).json({
                    status: 400,
                    error: 'Email is already exist.',
               });
          }
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new User({
               emailID,
               password: hashedPassword,
          });
          const savedUser = await newUser.save();

          res.status(201).json({
               status: 201,
               message: 'User Create successfully',
               data: savedUser,
          });
     } catch (error) {
          console.error('Error creating user:', error);
          res.status(500).json({
               status: 500,
               error: 'Internal Server Error',
          });
     }
};

const Login = async (req, res) => {
     try {
          const { emailID, password } = req.body;

          // Validate request body
          if (!emailID || !password) {
               return res.status(400).json({
                    status: 400,
                    error: 'Email and password are required fields.',
               });
          }
          const user = await User.findOne({ emailID });
          if (!user) {
               return res.status(401).json({
                    status: 401,
                    error: 'Invalid credentials. user not found.',
               });
          }

          // Validate the password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
               return res.status(401).json({
                    status: 401,
                    error: 'Invalid credentials. Password is incorrect.',
               });
          }

          // Generate JWT token
          const token = jwt.sign(
               { userId: user._id, email: user.emailID },
               process.env.JWT_SECRET,
               { expiresIn: '1h' }
          );

          res.json({
               status: 200,
               message: 'Login successful',
               token,
               user
          });

     } catch (error) {
          res.status(500).json({
               status: 500,
               error: error.message,
          });
     }
};
const ForgotPassword = async (req, res) => {
     try {
          const { emailID } = req.body;
          if (!emailID) {
               return res.status(400).json({
                    status: 400,
                    error: 'Email is required.',
               });
          }

          const user = await User.findOne({ emailID });
          if (!user) {
               return res.status(404).json({
                    status: 404,
                    error: 'User not found.',
               });
          }
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiry = Date.now() + OTP_EXPIRATION_TIME;

          user.otp = otp;
          user.otpExpiry = otpExpiry;
          user.otpAttempts = 0;
          await user.save();

          const transporter = nodemailer.createTransport({
               service: 'Gmail',
               auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
               },
          });

          const mailOptions = {
               from: process.env.EMAIL_USERNAME,
               to: emailID,
               subject: 'Reset Your Indic Account Password',
               text: `Hi Indic Indic User ,
We received a request to reset your Indic Account password.Please enter the reset-code to update your password ${otp}.
Please ignore this email if you do not wish to reset your password.`,
          };

          await transporter.sendMail(mailOptions);
          res.status(200).json({ status: 200, message: 'OTP sent to email.' });

     } catch (error) {
          console.error('Error in forgot password:', error);
          res.status(500).json({ message: 'Internal Server Error !!', error: error.message });
     }
};

const VerifyOtp = async (req, res) => {
     try {
          const { emailID, otp } = req.body;
          if (!emailID || !otp) {
               return res.status(400).json({
                    status: 400,
                    error: 'Email and OTP are required.',
               });
          }

          const user = await User.findOne({ emailID });
          if (!user) {
               return res.status(404).json({ status: 404, error: 'User not found.' });
          }

          if (user.otpAttempts >= 5) {
               return res.status(429).json({ status: 429, error: 'Maximum OTP attempts exceeded.' });
          }

          if (user.otp !== otp || user.otpExpiry < Date.now()) {
               user.otpAttempts += 1;
               await user.save();
               return res.status(400).json({ status: 400, error: 'Invalid or expired OTP.' });
          }

          user.otpAttempts = 0;
          await user.save();

          res.status(200).json({ status: 200, message: 'OTP verified. You may now reset your password.' });

     } catch (error) {
          console.error('Error verifying OTP:', error);
          res.status(500).json({ message: 'Internal Server Error !!', error: error.message });
     }
};

const ResetPassword = async (req, res) => {
     try {
          const { emailID, newPassword } = req.body;
          if (!emailID || !newPassword) {
               return res.status(400).json({
                    status: 400,
                    error: 'Email and new password are required.',
               });
          }

          const user = await User.findOne({ emailID });
          if (!user) {
               return res.status(404).json({ status: 404, error: 'User not found.' });
          }

          user.password = await bcrypt.hash(newPassword, 10);
          user.otp = null;
          user.otpExpiry = null;
          user.otpAttempts = 0;
          await user.save();

          res.status(200).json({ status: 200, message: 'Password reset successful.' });

     } catch (error) {
          console.error('Error resetting password:', error);
          res.status(500).json({ message: 'Internal Server Error !!', error: error.message });
     }
};


const Logout = async (req, res) => {
     try {
          const exist_token = req.body.token;
          // const userId = req.body.userId;
          // const email = req.body.email;
          // const exist_token = req.body(User.userId, User.email, token);

          if (!exist_token) {
               return res.status(401).json({ message: " Please login 🐳🐼" });
          }

          // res.clearCookie('exist_token', { path: '' });  //////////////////////////////////work in progress.....................................................................................................................................................................................................................
          res.status(200).json({ message: "Logout ok 🤧 ⌛" })

     } catch (error) {
          res.status(500).json({ message: 'not logout 🥺', error: error.message });
          console.error('Logout error:😶‍🌫️', error);
     }
}

module.exports = {
     Login,
     Registration,
     ForgotPassword,
     VerifyOtp,
     ResetPassword,
     Logout
};
