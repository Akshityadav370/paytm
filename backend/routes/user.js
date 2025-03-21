const express = require('express');
const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const zod = require('zod');

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

    const token = jwt.sign(newUser._id, JWT_SECRET);

    res.json({
      message: 'User created successfully!',
      token,
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
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      const token = jwt(userFound._id, JWT_SECRET);

      res.status(200).json({ message: 'Signed in successfully!', token });
      return;
    }

    res.status(411).json({
      message: 'Error while logging in',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while logging in',
    });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      password,
    });
    res.json({ user });
  } catch (error) {
    console.error(`Error changing user's data`, error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
