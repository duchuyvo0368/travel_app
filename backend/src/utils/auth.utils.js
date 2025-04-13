const crypto = require('crypto');
const { BadRequestError } = require('./error.response');
const authConfig = require('../config/auth.config');

class AuthUtils {
    static generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    static validatePassword(password) {
        if (!password || password.length < authConfig.PASSWORD.MIN_LENGTH) {
            throw new BadRequestError(`Password must be at least ${authConfig.PASSWORD.MIN_LENGTH} characters long`);
        }
        return true;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new BadRequestError('Invalid email format');
        }
        return true;
    }

    static validateUsername(username) {
        if (!username || username.length < 3) {
            throw new BadRequestError('Username must be at least 3 characters long');
        }
        return true;
    }

    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static isTokenExpired(expiresAt) {
        return Date.now() > expiresAt;
    }

    static sanitizeUser(user) {
        const sanitized = user.toObject();
        delete sanitized.password;
        delete sanitized.passwordConfirm;
        delete sanitized.passwordResetToken;
        delete sanitized.passwordResetExpires;
        delete sanitized.emailVerificationToken;
        return sanitized;
    }

    static validateRole(role) {
        const validRoles = Object.values(authConfig.ROLES);
        if (!validRoles.includes(role)) {
            throw new BadRequestError('Invalid role');
        }
        return true;
    }
}

module.exports = AuthUtils; 