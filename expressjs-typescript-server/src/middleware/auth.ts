import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Roles } from "../types";

const auth = (...roles: Roles[]) => {
  console.log(roles);
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      console.log(token);
      if (!token) {
        res.status(401).json({
          success: false,
          message: "unauthorized access!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decoded.email,
      ]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "user not found!",
        });
      }
      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden USER!",
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden USER!",
        });
      }
      req.user = decoded; //req : {user : {}}
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
