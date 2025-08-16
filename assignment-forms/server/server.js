// server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DB_PATH = process.env.DB_PATH || './data.db';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

// --- DB (super slim, file-based)
const db = new Database(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    address TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const stmts = {
  createUser: db.prepare(`INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`),
  findUserByEmail: db.prepare(`SELECT * FROM users WHERE email = ?`),
  insertEmployee: db.prepare(`
    INSERT INTO employees (full_name, username, email, phone, department, address, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  getEmployeesByUser: db.prepare(`
    SELECT id, full_name, username, email, phone, department, address, created_at
    FROM employees WHERE user_id = ?
    ORDER BY id DESC
  `),
  getEmployeeById: db.prepare(`
    SELECT id, full_name, username, email, phone, department, address, created_at
    FROM employees WHERE id = ? AND user_id = ?
  `),
};

// --- tiny helpers
function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authGuard(req, reply, done) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) throw new Error('No token');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    done(); // proceed
  } catch {
    reply.code(401).send({ error: 'Unauthorized' });
    // Do not throw, just return after sending response
  }
}

// --- routes
app.get('/health', async () => ({ ok: true }));

// Auth: Sign Up
app.post('/auth/signup', async (req, reply) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return reply.code(400).send({ error: 'fullName, email, password are required' });
  }
  const existing = stmts.findUserByEmail.get(email);
  if (existing) return reply.code(409).send({ error: 'Email already in use' });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = stmts.createUser.run(String(fullName), String(email), hash);
  const token = signJwt({ id: info.lastInsertRowid, email });
  return reply.code(201).send({ token });
});

// Auth: Sign In
app.post('/auth/signin', async (req, reply) => {
  const { email, password } = req.body || {};
  if (!email || !password) return reply.code(400).send({ error: 'email and password are required' });

  const user = stmts.findUserByEmail.get(email);
  if (!user) return reply.code(401).send({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(String(password), user.password_hash);
  if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });

  const token = signJwt({ id: user.id, email: user.email });
  return { token };
});

// Employees: Create (protected)
app.post('/employees', { preHandler: authGuard }, async (req, reply) => {
  app.log.info({ body: req.body, headers: req.headers }, 'Received /employees POST body');
  const { fullName, username, email, phone, department, address } = req.body || {};
  const required = [fullName, username, email, phone, department, address];
  if (required.some((v) => !v)) {
    app.log.warn({ body: req.body }, 'Missing required fields in /employees');
    return reply.code(400).send({ error: 'All fields are required' });
  }
  try {
    const info = stmts.insertEmployee.run(
      String(fullName),
      String(username),
      String(email),
      String(phone),
      String(department),
      String(address),
      req.user.id
    );
    reply.code(201).send({ id: info.lastInsertRowid });
  } catch (err) {
    app.log.error({ err }, 'Failed to insert employee');
    reply.code(500).send({ error: 'Internal server error' });
  }
});

// Employees: List (protected)
app.get('/employees', { preHandler: authGuard }, async (req) => {
  return stmts.getEmployeesByUser.all(req.user.id);
});

// Employees: One (protected)
app.get('/employees/:id', { preHandler: authGuard }, async (req, reply) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return reply.code(400).send({ error: 'Invalid id' });
  }
  const row = stmts.getEmployeeById.get(id, req.user.id);
  if (!row) return reply.code(404).send({ error: 'Not found' });
  return row;
});

// Global error handler for debugging
app.setErrorHandler((error, request, reply) => {
  app.log.error({ err: error }, 'Unhandled error');
  reply.code(500).send({ error: error.message || 'Internal server error' });
});

app.listen({ port: PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
