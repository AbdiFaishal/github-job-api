const jwt = require('jsonwebtoken');
const jwtkey = 'djqiqdkn21e21ne2190eioasdkAd';
const { User } = require('../../models');

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtkey);

    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
      attributes: ['id', 'fullname', 'username', 'email'],
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
