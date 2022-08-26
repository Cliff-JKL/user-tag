import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   // use(req: any, res: any, next: () => void) {
//     use(req: Request, res: Response, next: NextFunction) {
//     console.log('Request...');
//     next();
//   }
// }

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request | url: ${req.baseUrl} | method: ${req.method}`);
  next();
}
