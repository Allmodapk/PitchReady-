import type { Request, Response } from 'express';
import app from '../server/app.js';

/**
 * Vercel Serverless Function entrypoint.
 * Automatically detected by Vercel for all /api/* routes.
 */
export default function handler(req: Request, res: Response) {
  return app(req, res);
}
