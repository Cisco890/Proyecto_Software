const express = require('express');
const router = express.Router();
const pool = require('../db');

//prueba BORRAR
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Usuario LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;