import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//new
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env")
});
dotenv.config();
import OpenAI from "openai";

//new
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});




const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// In-memory "database"
const users = []; // { email, password, role }
const messagesByUser = new Map(); // userId -> [{ role, content, ts }]

// Helper to get messages array for a user
function getUserMessages(userId) {
  if (!messagesByUser.has(userId)) {
    messagesByUser.set(userId, []);
  }
  return messagesByUser.get(userId);
}

// Auth routes
app.post('/auth/register', (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }

  users.push({ email, password, role: role || 'user' });
  return res.json({ message: 'Registered successfully' });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Very simple "session" for demo – real app should use JWT or sessions
  return res.json({
    message: 'Login successful',
    user: { email: user.email, role: user.role },
  });
});

// Chat routes
/*app.post('/message', (req, res) => {
  const { message, userId } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const uid = userId || 'default-user';
  const history = getUserMessages(uid);

  const userMsg = { role: 'user', content: message, ts: Date.now() };
  history.push(userMsg);*/

  // Simple echo-style assistant for now
  /*const replyText = `You said: ${message}`;
 const assistantMsg = { role: 'assistant', content: replyText, ts: Date.now() };
  history.push(assistantMsg);

  return res.json({ reply: replyText });
});*/

app.post('/message', async (req, res) => {
  const { message, userId } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const uid = userId || 'default-user';
  const history = getUserMessages(uid);

  try {
    // Save user message
    const userMsg = { role: 'user', content: message, ts: Date.now() };
    history.push(userMsg);

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: history.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    const replyText = response.choices[0].message.content;

    // Save assistant reply
    const assistantMsg = {
      role: 'assistant',
      content: replyText,
      ts: Date.now()
    };
    history.push(assistantMsg);

    return res.json({ reply: replyText });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI error" });
  }
});


app.get('/history', (req, res) => {
  const userId = req.query.userId || 'default-user';
  const history = getUserMessages(userId);
  return res.json({ messages: history });
});

// Health check
app.get('/', (_req, res) => {
  res.send('AI Chatbot backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});


