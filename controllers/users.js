const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Rota: perfil do próprio usuário autenticado
router.get('/profile', (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    pool.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar perfil' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        res.json(results[0]);
    });
});

// Listar todos os utilizadores
router.get('/', (req, res) => {
    const sql = `
        SELECT id, first_name, last_name, age, email,
               username, birthday_date, phone_number,
               display_name, created_at
        FROM users
    `;
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
        res.json(results);
    });
});

// Search users por nome, excluindo o próprio
router.get('/search', (req, res) => {
    const search = req.query.name || '';
    const userId = req.user.id;
    const like = `%${search}%`;

    const sql = `
        SELECT id, username, display_name, first_name, last_name, email
        FROM users
        WHERE id <> ?
          AND (
            display_name LIKE ?
                OR username      LIKE ?
                OR CONCAT(first_name, ' ', last_name) LIKE ?
            )
    `;
    pool.query(sql, [userId, like, like, like], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao procurar utilizadores' });
        }
        res.json(results);
    });
});

// GET /users/:id — informações do utilizador + estado de amizade
router.get('/:id', (req, res) => {
    const targetId =req.params.id;
    const currentUserId = req.user.id;
    if (isNaN(targetId) || targetId <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const sql = `
        SELECT
            u.id,
            u.username,
            u.display_name,
            u.created_at,
            EXISTS(
                SELECT 1
                FROM friendships f
                WHERE (f.user_id = ? AND f.friend_id = ?)
                   OR (f.user_id = ? AND f.friend_id = ?)
            ) AS isFriend
        FROM users u
        WHERE u.id = ?
    `;

    pool.query(
        sql,
        [currentUserId, targetId, targetId, currentUserId, targetId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno no servidor' });
            }
            if (results.length === 0)
                return res.status(404).json({ error: 'Utilizador não encontrado' });
            res.json(results[0]);
        }
    );
});

// GET /users/:id/posts — posts filtrados por visibilidade ('public' ou 'friends')
router.get('/:id/posts', (req, res) => {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    const checkFriendSql = `
        SELECT COUNT(*) AS cnt
        FROM friendships f
        WHERE (f.user_id = ? AND f.friend_id = ?)
           OR (f.user_id = ? AND f.friend_id = ?)
    `;

    pool.query(
        checkFriendSql,
        [currentUserId, targetId, targetId, currentUserId],
        (err, friendResults) => {
            if (err)
                return res.status(500).json({ error: 'Erro interno ao verificar amizade' });

            const isFriend = friendResults[0].cnt > 0 || currentUserId === targetId;

            const postsSql = `
                SELECT id, content, visibility, created_at
                FROM posts
                WHERE author_id = ?
                  AND (
                    visibility = 'public'
                        OR (visibility = 'friends' AND ?)
                    )
                ORDER BY created_at DESC
            `;

            pool.query(postsSql, [targetId, isFriend], (err2, posts) => {
                if (err2)
                    return res.status(500).json({ error: 'Erro ao buscar posts' });
                res.json(posts);
            });
        }
    );
});

module.exports = router;
