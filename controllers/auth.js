const express = require('express');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');
const bcrypt  = require('bcrypt');

const router  = express.Router();
const SECRET  ='secretKey';

function setAuthCookie(res, payload) {
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
    });

    return token;
}

// Rota de login
// router.post('/login')
router.post('/login', (req, res) => {
    const email    = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    pool.query(
        'SELECT id, email, password_hash, display_name FROM users WHERE email = ?',
        [email],
        (err, results) => {
            if (err)   return res.status(500).json({ error: 'Erro no servidor' });
            if (!results.length)
                return res.status(401).json({ error: 'Email ou senha incorretos' });

            const { id, email: userEmail, password_hash, display_name } = results[0];

            bcrypt.compare(password, password_hash, (cmpErr, isMatch) => {
                if (cmpErr)   return res.status(500).json({ error: 'Erro ao verificar a senha' });
                if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

                setAuthCookie(res, { id,userId:id, email: userEmail, display_name });
                res.json({ message: 'Login efetuado com sucesso' });
            });
        }
    );
});

// Rota de registro
router.post('/register', (req, res) => {
    const {
        first_name,
        last_name,
        username,
        password,
        age,
        gender,
        address,
        phone_number,
        email,
        birthday_date,
        display_name
    } = req.body;

    // Validação mínima
    if (!first_name || !last_name || !username || !password ||
        age == null || !gender || !address ||
        !phone_number || !email || !birthday_date || !display_name) {
        return res
            .status(400)
            .json({ error: 'Todos os campos são obrigatórios (exceto created_at).' });
    }

    // 1) Hash da senha
    bcrypt.hash(password, 15, (hashErr, password_hash) => {
        if (hashErr) {
            console.error(hashErr);
            return res.status(500).json({ error: 'Erro ao processar a senha' });
        }

        // 2) Inserção no banco
        const sql = `
            INSERT INTO users
            (first_name,
             last_name,
             username,
             age,
             gender,
             address,
             phone_number,
             email,
             birthday_date,
             password_hash,
             display_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            first_name,
            last_name,
            email,
            age,
            gender,
            address,
            phone_number,
            email,
            birthday_date,
            password_hash,
            display_name
        ];

        pool.query(sql, params, (dbErr, results) => {
            if (dbErr) {
                console.error(dbErr);
                if (dbErr.code === 'ER_DUP_ENTRY') {
                    // trata duplicação de username ou e-mail
                    return res.status(409).json({ error: 'User already exists' });
                }
                return res.status(500).json({ error: 'Err Internal Server' });
            }

            // 3) Sucesso: retorna mensagem OK
             const userId = results.insertId;
            const token = setAuthCookie(res, { id: userId, email });
            res.status(201).json({ message: 'Conta criada e utilizador autenticado', token });
        });
    });
});

// controllers/auth.js
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false // true em produção
    });
    res.status(200).json({ message: 'Logout efetuado com sucesso!' });
});

module.exports = router;
