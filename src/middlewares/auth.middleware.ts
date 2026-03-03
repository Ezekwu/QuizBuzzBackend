import { NextFunction, Request, Response } from 'express';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.auth;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};
