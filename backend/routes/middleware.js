const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

const authMiddleWare = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      req.userId = decoded.userId;

      next();
    } catch (err) {
      console.error(err);
      return res.status(403).json({});
    }
  } catch (error) {
    console.error('Error doing the middleware check!', error);
    res.status(500).json({ error: 'Error doing the middleware check!' });
  }
};

module.exports = { authMiddleWare };
