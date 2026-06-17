import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'events-service',
  brokers: [process.env.KAFKA_BROKERS ?? 'kafka:9092'],
  retry: {
    initialRetryTime: 3000,
    retries: 10,
  },
});

export const topics = {
  movie: 'movie-events',
  user: 'user-events',
  payment: 'payment-events',
} as const;

export type EventType = keyof typeof topics;

export const allTopics = Object.values(topics);
