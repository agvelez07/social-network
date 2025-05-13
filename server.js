// server.js
const express = require('express');
const usersRouter = require('./routes/users');
const authRouter  = require('./routes/auth'); // se tiver rota de login/registro

const app = express();
app.use(express.json());



// Rotas que requerem token
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.get('/', (_req, res) => {
    res.send('Mini Social API com callbacks OK!')
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
