const UserModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const { Types } = require('mongoose');


class AuthRepository {
    static async createUser(userData) {
        return await UserModel.create(userData);
    }

    static async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    static async findUserByUsername(username) {
        return await UserModel.findOne({ username });
    }

    static async findUserByEmailOrUsername(emailOrUsername) {
        return await UserModel.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
    }

    static async findUserById(userId) {
        return await UserModel.findById(new Types.ObjectId(userId));
    }

    static async findUserByVerificationToken(token) {
        return await UserModel.findOne({ emailVerificationToken: token });
    }

    static async findUserByPasswordResetToken(token) {
        return await UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });
    }

    static async updateUser(userId, updateData) {
        return await UserModel.findByIdAndUpdate(
            new Types.ObjectId(userId),
            updateData,
            { new: true, runValidators: true }
        );
    }

    static async createOTP(email, otp) {
        return await OTPModel.create({
            email,
            otp,
            expiresAt: Date.now() + authConfig.OTP.EXPIRES_IN
        });
    }

    static async findOTP(email, otp) {
        return await OTPModel.findOne({
            email,
            otp,
            expiresAt: { $gt: Date.now() }
        });
    }

    static async deleteOTP(email) {
        return await OTPModel.deleteMany({ email });
    }

    static async updateUserPassword(userId, password) {
        return await UserModel.findByIdAndUpdate(
            new Types.ObjectId(userId),
            {
                password,
                passwordResetToken: undefined,
                passwordResetExpires: undefined,
                passwordChangedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
    }

    static async updateUserVerification(userId) {
        return await UserModel.findByIdAndUpdate(
            new Types.ObjectId(userId),
            {
                emailVerified: true,
                emailVerificationToken: undefined
            },
            { new: true }
        );
    }

    static async updateUserStatus(userId, isActive) {
        return await UserModel.findByIdAndUpdate(
            new Types.ObjectId(userId),
            { isActive },
            { new: true }
        );
    }
}

module.exports = AuthRepository; 