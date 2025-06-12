const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

/**
 * GET /likes/:postId
 * Lista quem deu like num post específico
 */
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    const query = `
        SELECT u.id AS userId, u.display_name AS likedBy, l.created_at
        FROM likes l
        JOIN users u ON u.id = l.user_id
        WHERE l.target_type = 'post' AND l.target_id = ?
    `;

    pool.query(query, [postId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao obter likes' });
        }
        res.json(results);
    });
});

/**
 * POST /likes
 * Cria um novo like (se ainda não existir)
 * Body esperado: { target_type: 'post'|'comment', target_id: number }
 */
router.post('/', (req, res) => {
    const userId = req.user.id;
    const { target_type, target_id } = req.body;

    if (!target_type || !target_id) {
        return res.status(400).json({ error: 'target_type e target_id são obrigatórios' });
    }

    const query = `
        INSERT INTO likes (user_id, target_type, target_id)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
    `;

    pool.query(query, [userId, target_type, target_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao adicionar like' });
        }
        res.status(201).json({ message: 'Like registado com sucesso' });
    });
});

/**
 * DELETE /likes
 * Remove like do utilizador autenticado
 * Body esperado: { target_type, target_id }
 */
router.delete('/', (req, res) => {
    const userId = req.user.id;
    const { target_type, target_id } = req.body;

    if (!target_type || !target_id) {
        return res.status(400).json({ error: 'target_type e target_id são obrigatórios' });
    }

    const query = `
        DELETE FROM likes
        WHERE user_id = ? AND target_type = ? AND target_id = ?
    `;

    pool.query(query, [userId, target_type, target_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao remover like' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Like não encontrado' });
        }
        res.json({ message: 'Like removido com sucesso' });
    });
});

module.exports = router;
