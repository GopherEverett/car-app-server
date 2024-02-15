const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 12;
const APP_SECRET = process.env.APP_SECRET

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

const comparePassword = async (storedPassword, password) => {
    return await bcrypt.compare(password, storedPassword);
}

const createToken = (payload) => {
    return jwt.sign(payload, APP_SECRET);
}

const stripToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            res.locals.token = token;
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Strip Token Error' });
    }
}

const verifyToken = (req, res, next) => {
    const { token } = res.locals;
    try {
        const payload = jwt.verify(token, APP_SECRET);
        if (payload) {
            res.locals.payload = payload;
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Verify Token Error' });
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    createToken,
    stripToken,
    verifyToken
}