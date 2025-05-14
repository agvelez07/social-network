const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// In-memory storage for likes (replace with DB calls as needed)
let likes = [];
let nextId = 1;

// Apply authentication to all /likes controllers
router.use(authenticateToken);

// GET /likes - list all likes
router.get('/', (req, res) => {
    res.json(likes);
});

// GET /likes/:id - get a specific like by id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const like = likes.find(l => l.id === id);
    if (!like) {
        return res.status(404).json({ error: 'Like not found' });
    }
    res.json(like);
});

// POST /likes - create a new like
// Expects { user_id, target_type, target_id }
router.post('/', (req, res) => {
    const { user_id, target_type, target_id } = req.body;
    if (!user_id || !target_type || !target_id) {
        return res.status(400).json({ error: 'user_id, target_type and target_id are required' });
    }
    const newLike = {
        id: nextId++,
        user_id,
        target_type,
        target_id,
        created_at: new Date().toISOString(),
    };
    likes.push(newLike);
    res.status(201).json(newLike);
});

// DELETE /likes/:id - remove a like
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = likes.findIndex(l => l.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Like not found' });
    }
    const removed = likes.splice(index, 1);
    res.json({ removed: removed[0] });
});

module.exports = router;
