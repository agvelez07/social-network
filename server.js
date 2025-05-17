const express = require('express');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const authRouter  = require('./controllers/auth');
const authenticateToken = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/users', usersRouter);

// 🔐 Protege a home
app.get('/', authenticateToken, (_req, res) => {
    res.send('Mini Social API com callbacks OK!');
});

// 🔐 Exemplo de rota protegida tipo /profile/1
app.get('/profile/:id', authenticateToken, (req, res) => {
    res.json({
        message: `Perfil protegido do utilizador ${req.params.id}`,
        user: req.user
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
