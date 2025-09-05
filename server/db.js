const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const databaseFilePath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(databaseFilePath);

function run(dbInstance, sql, params = []) {
  return new Promise((resolve, reject) => {
    dbInstance.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(dbInstance, sql, params = []) {
  return new Promise((resolve, reject) => {
    dbInstance.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(dbInstance, sql, params = []) {
  return new Promise((resolve, reject) => {
    dbInstance.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (_) {
    return fallback;
  }
}

function serializeGameRow(row) {
  return {
    id: row.id,
    title: row.title,
    genre: row.genre,
    description: row.description,
    releaseDate: row.releaseDate,
    price: row.price,
    rating: row.rating,
    image: row.image,
    trailer: row.trailer,
    screenshots: parseJsonField(row.screenshots, []),
    features: parseJsonField(row.features, []),
    systemRequirements: parseJsonField(row.systemRequirements, { minimum: {}, recommended: {} })
  };
}

function serializeCompanyRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    founded: row.founded,
    employees: row.employees,
    location: row.location,
    description: row.description,
    vision: row.vision,
    mission: row.mission,
    achievements: parseJsonField(row.achievements, []),
    team: parseJsonField(row.team, [])
  };
}

async function initializeDatabase(defaultGames = [], defaultCompany = null) {
  await run(db, `CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT NOT NULL,
    releaseDate TEXT NOT NULL,
    price REAL NOT NULL,
    rating REAL NOT NULL,
    image TEXT NOT NULL,
    trailer TEXT NOT NULL,
    screenshots TEXT,
    features TEXT,
    systemRequirements TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    founded TEXT,
    employees TEXT,
    location TEXT,
    description TEXT,
    vision TEXT,
    mission TEXT,
    achievements TEXT,
    team TEXT
  )`);

  // Users table for authentication
  await run(db, `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user'
  )`);

  const companyCountRow = await get(db, `SELECT COUNT(*) as count FROM company_info`);
  if ((companyCountRow?.count || 0) === 0) {
    const companyToInsert = defaultCompany || {
      name: 'Company',
      founded: '',
      employees: '',
      location: '',
      description: '',
      vision: '',
      mission: '',
      achievements: [],
      team: []
    };
    await run(db, `INSERT INTO company_info (id, name, founded, employees, location, description, vision, mission, achievements, team)
                  VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)` , [
      companyToInsert.name,
      companyToInsert.founded || '',
      companyToInsert.employees || '',
      companyToInsert.location || '',
      companyToInsert.description || '',
      companyToInsert.vision || '',
      companyToInsert.mission || '',
      JSON.stringify(companyToInsert.achievements || []),
      JSON.stringify(companyToInsert.team || [])
    ]);
  }

  const gamesCountRow = await get(db, `SELECT COUNT(*) as count FROM games`);
  if ((gamesCountRow?.count || 0) === 0 && Array.isArray(defaultGames) && defaultGames.length > 0) {
    for (const g of defaultGames) {
      await run(db, `INSERT INTO games (
        title, genre, description, releaseDate, price, rating, image, trailer, screenshots, features, systemRequirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        g.title,
        g.genre,
        g.description,
        g.releaseDate,
        g.price,
        g.rating,
        g.image,
        g.trailer,
        JSON.stringify(g.screenshots || []),
        JSON.stringify(g.features || []),
        JSON.stringify(g.systemRequirements || { minimum: {}, recommended: {} })
      ]);
    }
  }
}

async function getGames() {
  const rows = await all(db, `SELECT * FROM games ORDER BY id ASC`);
  return rows.map(serializeGameRow);
}

async function getGameById(id) {
  const row = await get(db, `SELECT * FROM games WHERE id = ?`, [id]);
  return row ? serializeGameRow(row) : null;
}

async function createGame(game) {
  const payload = {
    title: game.title,
    genre: game.genre,
    description: game.description,
    releaseDate: game.releaseDate,
    price: game.price,
    rating: game.rating,
    image: game.image,
    trailer: game.trailer,
    screenshots: JSON.stringify(game.screenshots || []),
    features: JSON.stringify(game.features || []),
    systemRequirements: JSON.stringify(game.systemRequirements || { minimum: {}, recommended: {} })
  };

  const result = await run(db, `INSERT INTO games (
    title, genre, description, releaseDate, price, rating, image, trailer, screenshots, features, systemRequirements
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    payload.title,
    payload.genre,
    payload.description,
    payload.releaseDate,
    payload.price,
    payload.rating,
    payload.image,
    payload.trailer,
    payload.screenshots,
    payload.features,
    payload.systemRequirements
  ]);

  const insertedId = result.lastID;
  return getGameById(insertedId);
}

async function updateGame(id, updates) {
  const existing = await getGameById(id);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...updates
  };

  await run(db, `UPDATE games SET
    title = ?,
    genre = ?,
    description = ?,
    releaseDate = ?,
    price = ?,
    rating = ?,
    image = ?,
    trailer = ?,
    screenshots = ?,
    features = ?,
    systemRequirements = ?
    WHERE id = ?`, [
      merged.title,
      merged.genre,
      merged.description,
      merged.releaseDate,
      merged.price,
      merged.rating,
      merged.image,
      merged.trailer,
      JSON.stringify(merged.screenshots || []),
      JSON.stringify(merged.features || []),
      JSON.stringify(merged.systemRequirements || { minimum: {}, recommended: {} }),
      id
    ]);

  return getGameById(id);
}

async function deleteGame(id) {
  await run(db, `DELETE FROM games WHERE id = ?`, [id]);
  return true;
}

async function getCompany() {
  const row = await get(db, `SELECT * FROM company_info WHERE id = 1`);
  return serializeCompanyRow(row);
}

async function updateCompany(payload) {
  const existing = await getCompany();
  const merged = {
    ...existing,
    ...payload
  };

  await run(db, `UPDATE company_info SET
    name = ?,
    founded = ?,
    employees = ?,
    location = ?,
    description = ?,
    vision = ?,
    mission = ?,
    achievements = ?,
    team = ?
    WHERE id = 1`, [
      merged.name,
      merged.founded || '',
      merged.employees || '',
      merged.location || '',
      merged.description || '',
      merged.vision || '',
      merged.mission || '',
      JSON.stringify(merged.achievements || []),
      JSON.stringify(merged.team || [])
    ]);

  return getCompany();
}

async function getUserByEmail(email) {
  return get(db, `SELECT * FROM users WHERE email = ?`, [email]);
}

async function getUserById(id) {
  return get(db, `SELECT * FROM users WHERE id = ?`, [id]);
}

async function createUser({ email, passwordHash, name = '', role = 'user' }) {
  const result = await run(db, `INSERT INTO users (email, passwordHash, name, role) VALUES (?, ?, ?, ?)`, [
    email,
    passwordHash,
    name,
    role
  ]);
  const insertedId = result.lastID;
  return getUserById(insertedId);
}

module.exports = {
  initializeDatabase,
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getCompany,
  updateCompany,
  getUserByEmail,
  getUserById,
  createUser
};


