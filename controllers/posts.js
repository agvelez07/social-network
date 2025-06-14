const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// O middleware authenticateToken deve popular req.user com { id, ... }
const router = express.Router();
router.use(authenticateToken);

/**
 * GET /posts
 * Lista posts do utilizador autenticado e públicos/amigos
 */
router.get('/', (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT
            p.id,
            p.content,
            p.created_at,
            p.visibility,
            p.author_id,
            u.display_name AS authorName,
            (SELECT COUNT(*) FROM likes l
             WHERE l.target_type = 'post'
               AND l.target_id = p.id
            ) AS likesCount,
            (SELECT COUNT(*) FROM comments c
             WHERE c.post_id = p.id
            ) AS commentsCount,
            EXISTS(
                SELECT 1 FROM likes l2
                WHERE l2.target_type = 'post'
                  AND l2.target_id = p.id
                  AND l2.user_id = ?
            ) AS likedByUser
        FROM posts p
                 JOIN users u ON u.id = p.author_id
        WHERE
            p.visibility = 'public'
           OR p.author_id = ?
           OR (
            p.visibility = 'friends' AND (
                EXISTS (
                    SELECT 1 FROM friendships f
                    WHERE
                        ((f.user_id = ? AND f.friend_id = p.author_id)
                            OR (f.friend_id = ? AND f.user_id = p.author_id))
                      AND f.status = 'accepted'
                )
                )
            )
        ORDER BY p.created_at DESC
    `;
    pool.query(query, [userId, userId, userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar publicações' });
        res.json(results);
    });
});

/**
 * POST /posts
 * Cria post para o utilizador autenticado (somente texto)
 */
router.post('/', (req, res) => {
    const { content, visibility } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }

    const query = 'INSERT INTO posts (author_id, content, visibility) VALUES (?, ?, ?)';
    pool.query(query, [userId, content, visibility], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar publicação' });
        }
        res.status(201).json({ message: 'Publicação criada com sucesso' });
    });
});

/**
 * DELETE /posts
 * Remove post do utilizador autenticado
 */
router.delete('/', (req, res) => {
    const { post_id: postId } = req.body;
    const userId = req.user.id;

    if (!postId) {
        return res.status(400).json({ error: 'post_id é obrigatório' });
    }

    const query = 'DELETE FROM posts WHERE author_id = ? AND id = ?';
    pool.query(query, [userId, postId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao eliminar publicação' });
        }
        res.status(200).json({ message: 'Publicação eliminada com sucesso' });
    });
});

/**
 * PUT /posts
 * Editar post do utilizador autenticado
 */
router.put('/', (req, res) => {
    const { post_id: postId, content } = req.body;
    const userId = req.user.id;

    if (!postId || !content) {
        return res.status(400).json({ error: 'post_id e content são obrigatórios' });
    }

    const query = 'UPDATE posts SET content = ? WHERE id = ? AND author_id = ?';
    pool.query(query, [content, postId, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao editar publicação' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Publicação não encontrada ou não és o autor' });
        }
        res.status(200).json({ message: 'Publicação editada com sucesso' });
    });
});

module.exports = router;
