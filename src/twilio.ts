import twilio from 'twilio';

export const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const startingMessage = "Hi there! I am Notionistic. I can help you with creating Notion pages. Just send me the content you want to add to the page. If you want to exit, just type 'done' or 'exit' or 'bye'.";
export const endingMessage = "Goodbye! Have a great day!";

export async function handleIncomingMessage(message: string) {
  if (message.toLowerCase() === "hi" || message.toLowerCase() === "hello") {
    await client.messages.create(
      {
        body: startingMessage,
        from: process.env.MY_TWILIO_NUM,
        to: process.env.MY_PERSONAL_NUM!
      }
    )
  } else  if (message.toLowerCase() === "done" || message.toLowerCase() === "exit" || message.toLowerCase() === "bye") {
    await client.messages.create(
      {
        body: endingMessage,
        from: process.env.MY_TWILIO_NUM,
        to: process.env.MY_PERSONAL_NUM!
      }
    )
  }
}

export async function sendTextMessage(body: string) {
  await client.messages.create({
    body: body,
    from: process.env.MY_TWILIO_NUM,
    to: process.env.MY_PERSONAL_NUM!
  });
}