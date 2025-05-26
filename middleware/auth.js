const jwt = require('jsonwebtoken');
const SECRET = "secretKey";

function authenticateToken(req, res, next) {
     const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso não autorizado.' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {npm
            return res.status(403).json({ error: 'Token inválido ou expirado. Acesso proibido.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
