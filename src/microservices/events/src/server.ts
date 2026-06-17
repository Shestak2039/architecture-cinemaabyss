import { createServer } from 'http';

import express from 'express';
import type { Request, Response } from 'express';

import { createEventHandler, connectProducer } from './producers.ts';
import { startConsumer } from './consumers.ts';

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT);

app.get('/api/events/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: true });
});

app.post('/api/events/movie', createEventHandler('movie'));
app.post('/api/events/user', createEventHandler('user'));
app.post('/api/events/payment', createEventHandler('payment'));

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Service is listening: ${PORT}`);
});

async function connectKafka() {
  await connectProducer();
  await startConsumer();
}

connectKafka().catch((err) => console.error('Kafka connection failed:', err));
