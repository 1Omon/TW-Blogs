import {User} from "./model.js"
// import { errorHandler } from '../utils/error.js';
// import bcryptjs from 'bcryptjs';
// import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const register = async (req,res,next) => {
  try {
    const {username, email, password} = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
        return res.json({msg: 'Username already used', status: false});
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
    return res.json({msg: 'Email already used', status: false}); 
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
   delete user.password;
   return res.json({status: true, user });
  } catch (ex){
    // next (ex);
    console.log(ex)
  }
}; 

export const login = async (req,res,next) => {
    try {
      const {username , password} = req.body;
      const user = await User.findOne({ username });
      console.log('1')
      if (!user) return res.json({msg: 'Incorrect username or password', status: false});
      const isPasswordValid = await bcrypt.compare(password, user.password)  
      console.log('2')
      if(!isPasswordValid)
      return res.json({msg: 'Incorrect username or password', status: false});
      console.log('3')
      
      // delete user.password;
      const token = jwt.sign({id: user._id}, process.env.jwt_secret, {expiresIn: '1d'})
     return res.json({status: true, user, token });
    } catch (ex){
      // next (ex);
    console.log(ex)

    }
  };

  export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      // next(error);
    console.log(error)

    }
  };



export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    throw new Error('You are not allowed to update this user')
    // return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      req.body.password = bcrypt.hash(req.body.password, 10);
     throw new Error('Password must be at least 6 characters')

    //   return next(errorHandler(400, 'Password must be at least 6 characters'));
    // }
  }}
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      throw new Error('username doesn\'t match format')
      // return next(
      //    errorHandler(400, 'Username must be between 7 and 20 characters')
      // );
    }
    if (req.body.username.includes(' ')) {
     throw new Error('username doesn\'t match format')

      // return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
     throw new Error('username doesn\'t match format')

      // return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
     throw new Error('username doesn\'t match format')
      // next(
      //   errorHandler(400, 'Username can only contain letters and numbers')
      // );
    }
  } 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    // next(error);

  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    // return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};



export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};