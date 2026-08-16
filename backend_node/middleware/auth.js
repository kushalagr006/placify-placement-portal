import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-123456789';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ detail: 'Could not validate authentication credentials' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Could not validate authentication credentials' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        detail: `Action not allowed for role '${req.user?.role}'. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};
