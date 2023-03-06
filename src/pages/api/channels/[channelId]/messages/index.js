import { getAllMessages, createMessage } from "@/database";

export default async function handler(req, res) {
  const { channelId } = req.query;

  switch (req.method) {
    case "GET":
      // Get all messages for a channel
      const messages = await getAllMessages(channelId)
    res.status(200).json(messages)
      break;
    case "POST":
      // Create a new message
      const { text, userName } = req.body;
  if (!text || !userName) {
    res.status(400).json({ message: "Missing message text or user name" });
    break;
  }
  const newMessage = await createMessage(text, channelId, userName);
  res.status(201).json(newMessage)
      break;
    default:
      res.status(405).end();
  }
}