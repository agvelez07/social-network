const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const authenticateToken = require('../middleware/auth');

// Todas as rotas exigem token
router.use(authenticateToken);

/* ------------------------------------------------------------------
   POST /friendships/request
   body: { friend_id: <int> }
------------------------------------------------------------------ */
router.post('/request', (req, res) => {
    const requesterId = req.user.id;
    const { friend_id } = req.body;

    if (!friend_id || friend_id === requesterId) {
        return res.status(400).json({ error: 'friend_id inválido.' });
    }

    // evitar duplicados ou inversos
    const verificar_sql = `
        SELECT id, status
        FROM friendships
        WHERE (user_id = ? AND friend_id = ?)
           OR (user_id = ? AND friend_id = ?)
            LIMIT 1
    `;
    pool.query(verificar_sql, [requesterId, friend_id, friend_id, requesterId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar amizade.' });
        if (rows.length) {
            return res.status(409).json({ message: 'Já existe um pedido ou amizade entre estes usuários.', status: rows[0].status });
        }

        const sql_insert = `
            INSERT INTO friendships (user_id, friend_id, status)
            VALUES (?, ?, 'pending')
        `;
        pool.query(sql_insert, [requesterId, friend_id], (err2, result) => {
            if (err2) return res.status(500).json({ error: 'Erro ao criar pedido de amizade.' });
            res.status(201).json({ id: result.insertId, requester_id: requesterId, friend_id, status: 'pending', requested_at: new Date().toISOString() });
        });
    });
});

/* ------------------------------------------------------------------
   GET /friendships/status/:friend_id
   → retorna o estado da amizade entre o user autenticado e o friend_id
------------------------------------------------------------------ */
router.get('/status/:friend_id', (req, res) => {
    const userId = req.user.id;
    const friendId = parseInt(req.params.friend_id, 10);

    if (!friendId || friendId === userId) {
        return res.status(400).json({ status: 'none' });
    }

    const statusSql = `
        SELECT status, user_id, friend_id
        FROM friendships
        WHERE (user_id = ? AND friend_id = ?)
           OR (user_id = ? AND friend_id = ?)
        LIMIT 1
    `;
    pool.query(statusSql, [userId, friendId, friendId, userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar estado.' });
        if (!rows.length) return res.json({ status: 'none' });
        // Se fores tu que enviaste o pedido
        if (rows[0].status === 'pending' && rows[0].user_id === userId) {
            return res.json({ status: 'pending_sent' });
        }
        // Se recebeste o pedido e está pendente
        if (rows[0].status === 'pending' && rows[0].friend_id === userId) {
            return res.json({ status: 'pending_received' });
        }
        // Aceite
        if (rows[0].status === 'accepted') {
            return res.json({ status: 'accepted' });
        }
        // Rejeitado ou outra situação
        return res.json({ status: rows[0].status || 'none' });
    });
});


/* ------------------------------------------------------------------
   POST /friendships/accept/:id
------------------------------------------------------------------ */
router.post('/accept/:id', (req, res) => {
    const friendshipId = req.params.id;
    const userId = req.user.id; // quem está aceitando

    const pedido_sql = `
        UPDATE friendships
        SET status = 'accepted'
        WHERE id = ?
          AND friend_id = ?
          AND status = 'pending'
    `;
    pool.query(pedido_sql, [friendshipId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao aceitar pedido.' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado ou você não tem permissão.' });
        }
        res.json({ id: friendshipId, status: 'accepted' });
    });
});

/* ------------------------------------------------------------------
   POST /friendships/reject/:id
------------------------------------------------------------------ */
router.post('/reject/:id', (req, res) => {
    const friendshipId = req.params.id;
    const userId = req.user.id;

    const pedido_sql = `
        UPDATE friendships
        SET status = 'rejected'
        WHERE id = ?
          AND friend_id = ?
          AND status = 'pending'
    `;
    pool.query(pedido_sql, [friendshipId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao rejeitar pedido.' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado ou você não tem permissão.' });
        }
        res.json({ id: friendshipId, status: 'rejected' });
    });
});

/* ------------------------------------------------------------------
   GET /friendships
   → retorna todos os amigos aceitos do usuário autenticado
------------------------------------------------------------------ */
router.get('/', (req, res) => {
    const userId = req.user.id;

    const pedido_sql = `
        SELECT
            f.id                        AS friendship_id,
            u.id                        AS friend_id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.username                  AS email,
            f.created_at
        FROM friendships f
                 JOIN users u
                      ON u.id = IF(f.user_id = ?, f.friend_id, f.user_id)
        WHERE (f.user_id = ? OR f.friend_id = ?)
          AND f.status = 'accepted'
        ORDER BY f.created_at DESC
    `;
    pool.query(pedido_sql, [userId, userId, userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar amigos.' });
        res.json({ friends: rows });
    });
});

/* ------------------------------------------------------------------
   GET /friendships/requests
   → lista pedidos PENDENTES recebidos pelo usuário autenticado
------------------------------------------------------------------ */
router.get('/requests', (req, res) => {
    const userId = req.user.id;

    const pedido_sql = `
        SELECT
            f.id                   AS friendship_id,
            f.user_id              AS requester_id,
            CONCAT(u.first_name, ' ', u.last_name) AS requester_name,
            u.username             AS requester_email,
            f.requested_at         AS requested_at
        FROM friendships f
                 JOIN users u ON u.id = f.user_id
        WHERE f.friend_id = ?
          AND f.status = 'pending'
        ORDER BY f.requested_at DESC
    `;
    pool.query(pedido_sql, [userId], (err, rows) => {
        // console.error('Erro SQL:', err);
        if (err) return res.status(500).json({ error: 'Erro ao listar pedidos pendentes.' });
        res.json({ requests: rows });
    });
});

/* ------------------------------------------------------------------
   GET /friendships/birthdays/today
   → retorna todos os amigos que fazem aniversário hoje
------------------------------------------------------------------ */
router.get('/birthdays/today', (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const todaySql = `
        SELECT
            u.id                                    AS friend_id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.username                              AS email,
            u.birthday_date                         AS birthday
        FROM friendships f
                 JOIN users u
                      ON u.id = IF(f.user_id = ?, f.friend_id, f.user_id)
        WHERE (f.user_id = ? OR f.friend_id = ?)
            AND f.status = 'accepted'
            AND MONTH(u.birthday_date) = MONTH(CURDATE())
          AND DAY(u.birthday_date)   = DAY(CURDATE())
    `;

    pool.query(todaySql, [userId, userId, userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar aniversários de hoje.' });
        }
        res.json({ birthdays: rows });
    });
});

module.exports = router;
