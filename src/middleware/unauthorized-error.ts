import {
  Request,
  Response,
  NextFunction,
} from 'express';

interface UnauthorizedError {
  name: string;
  message: string;
}

const isUnauthorizedError = (
  err: any,
): err is UnauthorizedError => (
  err.name === 'UnauthorizedError'
  && err.message !== undefined
);

const unauthorizedError = (
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isUnauthorizedError(err)) {
    res.status(401).json({
      message: err.message,
    });
    return;
  }
  next();
};

export default unauthorizedError;
