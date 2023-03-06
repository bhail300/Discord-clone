import { getAllChannels, createChannel } from "@/database";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      // Get all channels
      const channels = await getAllChannels()
      res.status(200).json(channels)
      break;
    case "POST":
      // Create a new channel
      const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Missing channel name" });
    break;
  }
  const newChannel = await createChannel(name);
  res.status(201).json(newChannel);
      break;
    default:
      res.status(405).end();
  }
}