// server.js
const express       = require('express');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');

const authRouter        = require('./controllers/auth');
const usersRouter       = require('./controllers/users');
const postsRouter       = require('./controllers/posts');
const commentsRouter    = require('./controllers/comments');
const likesRouter = require('./controllers/like');
const friendshipsRouter = require('./controllers/friendships');

const app = express();

// 1) Precisamos do cookie-parser para ler/escrever cookies
app.use(cookieParser());

// 2) Habilita CORS para o seu front-end em localhost:3000 e
//    permite envio de credenciais (cookies)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// 3) Body parsers para JSON e form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4) Suas rotas:
app.use('/auth',        authRouter);
app.use('/users',       usersRouter);
app.use('/posts',       postsRouter);
app.use('/comments',    commentsRouter);
app.use('/likes',likesRouter);
app.use('/friendships', friendshipsRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
