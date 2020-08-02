import amqp from 'amqplib';
import { QUEUE_NAME } from '../config/constant';

export const AMQPconnect = () => amqp.connect('amqp://localhost:5672');

export const sendToQueue = async (data) => {
  try {
    const amqpClient = await AMQPconnect();
    const channel = await amqpClient.createChannel();

    channel.assertQueue(QUEUE_NAME, {
      durable: false
    });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
    console.log(' [x] Sent %s', JSON.stringify(data));
  } catch (err) {
    throw err;
  }
};
