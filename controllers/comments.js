const express = require('express');
const pool = require('../db');
const authenticateToken = require("../middleware/auth");

const router = express.Router();
router.use(express.json());
router.use(authenticateToken);

// GET /comments/:id → Listar comentários de um post
router.get('/:id', (req, res) => {
    const postID = req.params.id;
    const query = `
        SELECT
            c.id,
            c.post_id,
            c.content,
            c.created_at,
            c.author_id  AS authorId,
            u.display_name AS authorName
        FROM comments c
                 JOIN users u ON u.id = c.author_id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
    `;
    pool.query(query, [postID], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar comentários' });
        res.json(results);
    });
});

// POST /comments → Criar comentário
router.post('/', (req, res) => {
    const { post_id, content } = req.body;
    // Removido operador ??, uso de ternário para tratar null/undefined
    const author_id = req.user.userId != null ? req.user.userId : req.user.id;
    if (!post_id || !content) {
        return res.status(400).json({ error: 'post_id e content são obrigatórios' });
    }
    const query = `
        INSERT INTO comments (post_id, author_id, content)
        VALUES (?, ?, ?)
    `;
    pool.query(query, [post_id, author_id, content], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar comentário' });
        res.status(201).json({ message: 'Comentário criado com sucesso' });
    });
});

/* PUT /comments → Editar comentário (só autor) */
router.put('/', (req, res) => {
    const { comment_id, content } = req.body;
    // Removido operador ??
    const userId = req.user.userId != null ? req.user.userId : req.user.id;
    if (!comment_id || !content) {
        return res.status(400).json({ error: 'comment_id e content são obrigatórios' });
    }

    // Verifica autor
    const checkSql = `SELECT author_id FROM comments WHERE id = ?`;
    pool.query(checkSql, [comment_id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar comentário' });
        if (!rows.length) return res.status(404).json({ error: 'Comentário não encontrado' });
        if (rows[0].author_id !== userId) {
            return res.status(403).json({ error: 'Não tem permissão para editar este comentário' });
        }

        // Update
        const updateSql = `UPDATE comments SET content = ? WHERE id = ?`;
        pool.query(updateSql, [content, comment_id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Erro ao editar comentário' });
            res.json({ message: 'Comentário editado com sucesso' });
        });
    });
});

/* DELETE /comments → Eliminar comentário (só autor) */
router.delete('/', (req, res) => {
    const { comment_id } = req.body;
    // Removido operador ??
    const userId = req.user.userId != null ? req.user.userId : req.user.id;
    if (!comment_id) {
        return res.status(400).json({ error: 'comment_id é obrigatório' });
    }
    const checkSql = `SELECT author_id FROM comments WHERE id = ?`;
    pool.query(checkSql, [comment_id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar comentário' });
        if (!rows.length) return res.status(404).json({ error: 'Comentário não encontrado' });
        if (rows[0].author_id !== userId) {
            return res.status(403).json({ error: 'Não tem permissão para apagar este comentário' });
        }
        const deleteSql = `DELETE FROM comments WHERE id = ?`;
        pool.query(deleteSql, [comment_id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Erro ao eliminar comentário' });
            res.json({ message: 'Comentário eliminado com sucesso' });
        });
    });
});

module.exports = router;
