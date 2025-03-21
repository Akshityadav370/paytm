const express = require('express');
const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const zod = require('zod');
const { authMiddleWare } = require('../routes/middleware');

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.post('/signup', async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: 'Incorrect inputs',
      });
    }

    const { firstName, lastName, password, username } = req.body;

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return res.status(411).json({
        message: 'Email already taken/Incorrect inputs',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      username,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    res.json({
      message: 'User created successfully!',
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: 'Incorrect inputs',
      });
      return;
    }

    const { username, password } = req.body;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      res.status(411).json({ message: 'User not found!' });
      return;
    }

    const correctUser = await bcrypt.compare(password, user.password);
    if (!correctUser) {
      res.status(411).json({ message: 'Incorrect username/password!' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({ message: 'Signed in successfully!', token });
  } catch (error) {
    res.status(500).json({
      message: 'Error while logging in',
    });
  }
});

router.put('/', authMiddleWare, async (req, res) => {
  try {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: 'Error while updating information',
      });
      return;
    }
    const { firstName, lastName, password } = req.body;
    const { id } = req.userId;
    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      password,
    });
    res.json({
      message: 'Updated successfully',
    });
  } catch (error) {
    console.error(`Error changing user's data`, error);
    res.status(500).json({ message: error });
  }
});

router.get('/bulk', authMiddleWare, async (req, res) => {
  const filter = req.query.filter || '';
  try {
    const data = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.json({
      users: data.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.error('Error fetching bulk', error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
