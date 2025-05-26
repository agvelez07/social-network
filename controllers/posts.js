const express = require('express');
const pool = require('../db');
const authenticateToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
// router.use(authenticateToken);

//GET posts
router.get('/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10);
    if (isNaN(userID)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const query = `SELECT p.*, (SELECT COUNT(*) FROM likes l WHERE l.target_type = 'post' AND l.target_id = p.id) AS likesCount, 
       (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS commentsCount FROM posts p WHERE p.author_id = ? ORDER BY p.created_at DESC`;

    pool.query(query, [userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar os posts' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Sem publicações.' });
        }
        res.json(results);
    });
});


//ADD post
router.post('/:id',(req, res) => {
    const query = 'INSERT INTO posts (author_id, content, visibility) VALUES (?, ?, ?)';

    // const values = [
    //     req.params.id,
    //     req.body.content,
    //     req.body.visibility
    // ]

    pool.query(query, /*values*/[req.params.id, req.body.content, req.body.visibility] ,(err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error creating post'});
        }
        res.status(200).json('Post has been created');
    });
})

//DELETE post
router.delete('/',(req, res) => {
    const author_id = req.body.author_id;
    const post_id = req.body.post_id;
    const query = 'DELETE FROM posts WHERE author_id = ? AND id = ?';

    pool.query(query, [author_id, post_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting post'});
        }
        res.status(200).json('Post has been deleted');
    })
})
module.exports = router;