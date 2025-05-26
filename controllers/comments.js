// routes/comment.js
const express = require('express');
const pool = require('../db');
const authenticateToken = require("../middleware/auth");
const router = express.Router();
// router.use(authenticateToken);

//GET comments
router.get('/:id', (req, res) => {
    const postID = req.params.id;
    const query = 'SELECT c.*, u.id AS userID FROM comments AS c JOIN users AS u ON (u.id = c.author_id) WHERE c.post_id = ? ORDER BY c.created_at ASC';

    pool.query(query, postID,(err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error getting post'});
        }
        if(results.length === 0) {
            return res.status(404).json({message: 'No Comments Found'});
        }
        res.json(results);
    })
})

//POST comment
router.post('/', (req, res) => {
    const post_id = req.body.post_id;
    const author_id = req.body.author_id;
    const content = req.body.content;

    const query = 'INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)';

    pool.query(query, [post_id, author_id, content],(err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error creating comment'});
        }
        res.status(200).json('Comment has been created');
    });
})

//DELETE comment
router.delete('/',(req, res) => {
    const comment_id = req.body.comment_id;
    const query = 'DELETE FROM comments WHERE id = ?';

    pool.query(query, comment_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting post'});
        }
        res.status(200).json('Post has been deleted');
    })
})
module.exports = router;
