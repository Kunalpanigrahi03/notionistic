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
    const elapsedTime = calculateElapsedTime();
    const studyTime = formatTime(elapsedTime);
    
    await client.messages.create(
      {
        body: endingMessage,
        from: process.env.MY_TWILIO_NUM,
        to: process.env.MY_PERSONAL_NUM!
      }
    )

    await client.messages.create(
      {
        body: `You studied for ${studyTime}.`,
        from: process.env.MY_TWILIO_NUM,
        to: process.env.MY_PERSONAL_NUM!
      }
    )
  }
}

function calculateElapsedTime(firstRequestTime?: number): number {
  const currentTime = Date.now();
  const elapsedTime = firstRequestTime ? currentTime - firstRequestTime : 0;
  return elapsedTime;
}

function formatTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${minutes} minutes and ${seconds} seconds`;
}

export async function sendTextMessage(body: string) {
  await client.messages.create({
    body: body,
    from: process.env.MY_TWILIO_NUM,
    to: process.env.MY_PERSONAL_NUM!
  });
}