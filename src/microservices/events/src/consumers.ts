import { kafka, allTopics } from './kafka.ts';

const consumer = kafka.consumer({ groupId: 'events-service-group' });

export async function startConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topics: allTopics, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString() ?? '';

      console.log(
        `Consumed event from topic ${topic} (partition ${partition}, offset ${message.offset}):`,
        value,
      );
    },
  });

  console.log('Consumer connected and subscribed:', allTopics.join(', '));
}
