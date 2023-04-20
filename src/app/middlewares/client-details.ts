import {NextFunction, Request, Response} from 'express';

export function extractClientDetails(req: Request, res: Response, next: NextFunction) {
  let ipAddr: string;
  let proxy: string;
  const agent: string = req.headers['user-agent'] || '';
  if (req.headers.via) {
    // yes
    ipAddr = req.headers['x-forwarded-for'] as string;
    proxy = req.headers.via;
  } else {
    // no
    ipAddr = req.connection.remoteAddress as string;
    proxy = 'none';
  }
  req.client = {agent, ipAddr, proxy};
  next();
}
