const express = require('express');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const authRouter  = require('./controllers/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
    res.send('Mini Social API com callbacks OK!');
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
