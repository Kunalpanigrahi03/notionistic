import express, { Request, Response, NextFunction } from "express";
import 'dotenv/config';
import { createNotionPage } from './notion';
import { handleIncomingMessage, sendTextMessage } from './twilio';
import { generateAiContext } from './gemini';
import { MongoClient } from 'mongodb';

interface CustomRequest extends Request {
  requestTime?: number;
}
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let firstRequestTime: number | undefined;

app.use((_req: CustomRequest, _res: Response, _next: NextFunction) => {
  _req.requestTime = Date.now();

  if (!firstRequestTime) {
    firstRequestTime = _req.requestTime;
  }

  _next();
});

const timeFrame = 5 * 60 * 1000;

app.use(async (_req: CustomRequest, _res: Response, _next: NextFunction) => {
  if (firstRequestTime) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - firstRequestTime;
    const remainingTime = timeFrame - elapsedTime;

    if (elapsedTime < timeFrame) {
      const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
      const nextAllowedTime = new Date(currentTime + remainingTime).toLocaleString();
      await sendTextMessage(`Time remaining: ${remainingMinutes} minutes. You can continue at ${nextAllowedTime}.`);
      _res.status(403).send("You are not allowed to send messages yet. Please wait for the specified time frame to elapse.");
    } else {
      _next();
    }
  } else {
    _next();
  }
});

const port = 3000;

function sendTimerMessages() {
  const currentTime = Date.now();
  const elapsedTime = firstRequestTime ? currentTime - firstRequestTime : 0;
  const remainingTime = timeFrame - elapsedTime;

  if (elapsedTime < timeFrame) {
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
    const nextAllowedTime = new Date(currentTime + remainingTime).toLocaleString();
    const message = `Time remaining: ${remainingMinutes} minutes. You can continue at ${nextAllowedTime}.`;
    sendTextMessage(message);

    setTimeout(sendTimerMessages, 60 * 1000); 
  }
}

async function handleTextMessage(_message: string) {
  console.log("Received text message:", _message);
  const description = await generateAiContext(JSON.stringify({ _message }));

  if (typeof description === 'string') {
    await createNotionPage(_message, description.substring(0, 2000));
    const newMessage = {
      type: 'text',
      content: _message,
      description: description,
      createdAt: new Date()
    };

    await client.connect();
    const collection = client.db('notionistic').collection('messages');
    await collection.insertOne(newMessage);

    sendTextMessage("Synced it to notion and Generated AI content");

    sendTimerMessages();
  } else {
    console.error('Description is not a string:', description);
  }
}

export async function handleImageMessage(_mediaUrl: string) {
  console.log("Received image message. Media URL:", _mediaUrl);
  const description = await generateAiContext(JSON.stringify({ _mediaUrl }));

  if (typeof description === 'string') {
    await createNotionPage(_mediaUrl, description.substring(0, 2000));
    const newMessage = {
      type: 'image',
      content: _mediaUrl,
      description: description,
      createdAt: new Date()
    };

    await client.connect();
    const collection = client.db('notionistic').collection('messages');
    await collection.insertOne(newMessage);

    sendTextMessage("Synced it to notion and Generated AI content");

    sendTimerMessages();
  } else {
    console.error('Description is not a string:', description);
  }
}

app.post('/', async (_req: CustomRequest, _res: Response) => {
  const { body } = _req;

  if (body.NumMedia && parseInt(body.NumMedia) > 0) {
    const mediaUrl = body.MediaUrl0;
    await handleImageMessage(mediaUrl);
  } else {
    const message = body.Body;
    if (message === "hi" || message === "hello" || message === "Hi" || message === "Hello" || message === "bye" || message === "done" || message === "exit" || message === "Bye" || message === "Done" || message === "Exit") {
      await handleIncomingMessage(message);
    }
    else await handleTextMessage(message);
  }

  _res.status(200).send();
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));