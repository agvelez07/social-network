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



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
