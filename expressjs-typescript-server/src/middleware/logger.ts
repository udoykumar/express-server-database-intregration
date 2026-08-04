import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("method", req.method, req.url, Date.now());
  const log = `\nmethod => ${req.method} time=> ${Date.now()} url => ${req.url}\n`;

  fs.appendFile("logger.txt", log, (err) => {});
  next();
};
export default logger;
