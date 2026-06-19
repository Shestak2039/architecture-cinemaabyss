import { createServer } from 'http';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { NextFunction, Request, Response } from 'express';

const app = express();

const PORT = Number(process.env.PORT);
const monolithUrl = process.env.MONOLITH_URL;
const moviesServiceUrl = process.env.MOVIES_SERVICE_URL;
const eventsServiceUrl = process.env.EVENTS_SERVICE_URL;
const gradualMigration = process.env.GRADUAL_MIGRATION === 'true';
const moviesMigrationPercent = Number(process.env.MOVIES_MIGRATION_PERCENT);

const toMovies = createProxyMiddleware({ target: moviesServiceUrl, changeOrigin: true });
const toMonolith = createProxyMiddleware({ target: monolithUrl, changeOrigin: true });
const toEvents = createProxyMiddleware({ target: eventsServiceUrl, changeOrigin: true });

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/movies')) {
    const useNewService = !gradualMigration || Math.random() * 100 < moviesMigrationPercent;

    return useNewService ? toMovies(req, res, next) : toMonolith(req, res, next);
  }

  if (req.path.startsWith('/api/events')) {
    return toEvents(req, res, next);
  }

  return toMonolith(req, res, next);
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening: ${PORT}`);
});
