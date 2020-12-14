const { User } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtkey = 'djqiqdkn21e21ne2190eioasdkAd';

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['id', 'username', 'fullname', 'email'],
    });

    res.send({
      message: 'User Valid',
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: {
        message: err.message,
      },
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { username, password, email, fullname } = req.body;

    const schema = Joi.object({
      fullname: Joi.string().min(4).required(),
      username: Joi.string().trim().min(6).required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const userExist = await User.findOne({
      where: {
        username,
      },
    });

    if (userExist) {
      return res.status(400).send({
        error: {
          message: 'Username already exist',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      ...req.body,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtkey
    );

    res.status(201).send({
      message: 'Your new account has been created successfully',
      data: {
        username: user.username,
        token,
      },
    });
  } catch (err) {
    res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(6).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).send({
        error: {
          message: 'Username or password is incorrect',
        },
      });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(401).send({
        error: {
          message: 'Username or password is incorrect',
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtkey
    );

    res.send({
      message: 'Login success',
      user: {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
      token,
    });
  } catch (err) {
    res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
};
