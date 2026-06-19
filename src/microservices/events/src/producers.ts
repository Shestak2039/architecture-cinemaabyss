import type { Request, Response } from 'express';

import { kafka, topics, type EventType } from './kafka.ts';

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();

  console.log('Producer connected');
}

export async function publishEvent(type: EventType, payload: unknown) {
  const topic = topics[type];
  const event = { type, timestamp: new Date().toISOString(), payload };

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log(`Produced event to topic ${topic}:`, JSON.stringify(event));

  return event;
}

export function createEventHandler(type: EventType) {
  return async (req: Request, res: Response) => {
    try {
      const event = await publishEvent(type, req.body);

      res.status(201).json({ status: 'success', event });
    } catch (err) {
      console.error(`Failed to publish ${type} event`, err);

      res.status(500).json({ status: 'error', message: (err as Error).message });
    }
  };
}
