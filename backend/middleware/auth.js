const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'No token, access denied' });

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
