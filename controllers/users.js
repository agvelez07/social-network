// controllers/users.js
const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Rota para verificar se o utilizador está autenticado
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Utilizador autenticado com sucesso',
        user: req.user, // contém id e email vindos do token JWT
    });
});


// Listar todos os utilizadores
router.get('/', (req, res) => {
    pool.query(
        'SELECT id,first_name,last_name,age,email ,username, birthday_date, phone_number, display_name, created_at FROM users',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }
            res.json(results);
        }
    );
});

// Obter um utilizador por ID
router.get('/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    pool.query(
        'SELECT id, username, display_name, created_at FROM users WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            }
            res.json(results[0]);
        }
    );
});

module.exports = router;
