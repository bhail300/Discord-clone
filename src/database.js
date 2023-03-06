import mysql from "mysql2";

export const pool =
  global.pool ||
  mysql
    .createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    })
    .promise();

if (process.env.NODE_ENV !== "production") global.pool = pool;

// Channels

export async function getAllChannels() {
  const [rows] = await pool.query("SELECT * FROM channels");
  return rows;
}

export async function getChannelById(id) {
  const [rows] = await pool.query(
    `
  SELECT *, (SELECT COUNT(*) FROM messages WHERE messages.channel_id = channels.id) AS totalMessages, 
  (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', messages.id, 'text', messages.text, 'userName', messages.userName, 'created', messages.created)) FROM messages WHERE messages.channel_id = channels.id) AS messages
  FROM channels WHERE channels.id = ?
  `,
    [id, id]
  );
  const channel = rows[0];
  return channel
}


export async function updateChannelById(id, name) {
  await pool.query("UPDATE channels SET name = ? WHERE id = ?", [name, id]);
  const [rows] = await pool.query("SELECT * FROM channels WHERE id = ?", [id]);
  return rows[0];
}

export async function createChannel(name) {
  await pool.query("INSERT INTO channels (name) VALUES (?)", [name]);
  const [rows] = await pool.query(
    "SELECT * FROM channels WHERE id = LAST_INSERT_ID()"
  );
  return rows[0];
}

export async function deleteChannelById(id) {
  await pool.query("DELETE FROM channels WHERE id = ?", [id]);
}

// Messages

export async function getAllMessages(chatId) {
  const [rows] = await pool.query(
    "SELECT * FROM messages WHERE channel_id = ?",
    [chatId]
  );
  return rows;
}

export async function getMessageById(id) {
  const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [id]);
  return rows[0];
}

export async function updateMessageById(id, text) {
  await pool.query("UPDATE messages SET text = ? WHERE id = ?", [text, id]);
  const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [id]);
  return rows[0];
}

export async function createMessage(text, channelId, userName) {
  await pool.query(
    "INSERT INTO messages (text, channel_id, userName) VALUES (?, ?, ?)",
    [text, channelId, userName]
  );
  const [rows] = await pool.query(
    "SELECT * FROM messages WHERE id = LAST_INSERT_ID()"
  );
  return rows[0];
}

export async function deleteMessageById(id) {
  await pool.query("DELETE FROM messages WHERE id = ?", [id]);
}