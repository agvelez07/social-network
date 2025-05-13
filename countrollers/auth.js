const express = require('express');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');
const bcrypt  = require('bcrypt');

const router  = express.Router();
const SECRET  ='secretKey';

// Rota de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 1) Busca o usuário pelo username
    pool.query(
        'SELECT id, password_hash FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Usuário ou senha incorretos' });
            }

            const { id, password_hash } = results[0];

            // 2) Verificação da senha
            bcrypt.compare(password, password_hash, (cmpErr, isMatch) => {
                if (cmpErr) {
                    console.error(cmpErr);
                    return res.status(500).json({ error: 'Erro ao verificar a senha' });
                }
                if (!isMatch) {
                    return res.status(401).json({ error: 'Usuário ou senha incorretos' });
                }

                // 3) Gera e devolve o token
                const token = jwt.sign({ id, username }, SECRET, { expiresIn: '1h' });
                res.json({ token });
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
            username,
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
            res.status(201).json({ message: 'User Has Been Created' });
        });
    });
});

// countrollers/auth.js
router.post('/logout', (req, res) => {
    // não há nada a invalidar no servidor
    res.status(200).json({ message: 'Desconectado com sucesso' });
});

module.exports = router;
