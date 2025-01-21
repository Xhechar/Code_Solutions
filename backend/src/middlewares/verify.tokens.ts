import { NextFunction, Request, Response } from "express";
import { TokenDetails } from "../interfaces/solutions.interfaces";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  info?: TokenDetails;
}
export const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let authHeader = req.headers["authorization"] as string;

  if (!authHeader) {
    res.status(401).json({
      'success': false,
      'error': 'You are not allowed to access this service. Login.'
    });
  }

  let token = authHeader.split(" ")[1];

  try {

    jwt.verify(token, process.env.SECRET_KEY as string, (error, data) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') {
          res.status(401).json({
            'success': false,
            'error': 'Invalid token provided.'
          });
        } else if (error.name === 'TokenExpiredError') {
          res.status(401).json({
            'success': false,
            'error': 'Token expired. Login again.'
          });
        } else {
          res.status(500).json({
            'success': false,
            'error': 'An error occurred while verifying the token.'
          });
        }
      } else {
        req.info = data as TokenDetails;
        next();
      }
    })
    
  } catch (error) {
    res.status(403).json({
      'success': false,
      'error': 'Invalid token provided.'
    });
  }
}

export const getIdFromToken = (req: ExtendedRequest): string => {
  
  let data = req.info as TokenDetails;

  if (!data) {
    return ''
  }

  if (data.UserId) {
    return ''
  }

  return data.UserId;
} 

export const verifyAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let data = req.info as TokenDetails;

  if (!data) {
    res.status(401).json({
      'success': false,
      'error': 'You are not allowed to access this service. Login.'
    });
  }

  if (data.Role!== 'admin') {
    res.status(401).json({
      'success': false,
      'error': 'You do not have the necessary permissions to access this service.'
    });
  } else {
    next();
  }
}

export const verifyUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let data = req.info as TokenDetails;

  if (!data) {
    res.status(401).json({
      'success': false,
      'error': 'You are not allowed to access this service. Login.'
    });
  }

  next();
}