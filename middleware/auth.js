// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = "d04a40e513273a607599f6baa0b449c6f7";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Se não houver token, retorna 401 Unauthorized
    if (!token) {
        return res
            .status(401)
            .json({ error: 'Token não fornecido. Acesso não autorizado.' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        // Se o token for inválido ou expirado, retorna 403 Forbidden
        if (err) {
            return res
                .status(403)
                .json({ error: 'Token inválido ou expirado. Acesso proibido.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
