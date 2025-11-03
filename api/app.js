const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const {
  DB_HOST = 'db', DB_PORT = 5432, DB_NAME = 'yugiohdb', DB_USER = 'yugiohuser', DB_PASS = 'yugiohpass', JWT_SECRET = 'secret'
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'username & password required' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'no token' });
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({ error: 'bad token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e){
    return res.status(401).json({ error: 'invalid token' });
  }
}

app.get('/search', authMiddleware, async (req, res) => {
  const q = req.query.q || '';
  try {
    const sql = `SELECT id, title, summary, tags FROM articles WHERE title ILIKE $1 OR content ILIKE $1 OR summary ILIKE $1 LIMIT 50`;
    const { rows } = await pool.query(sql, [`%${q}%`]);
    res.json({ results: rows });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/articles/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query('SELECT id,title,content,summary,tags FROM articles WHERE id=$1', [id]);
    if(rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(4000, () => console.log('Yugioh API running on 4000'));
