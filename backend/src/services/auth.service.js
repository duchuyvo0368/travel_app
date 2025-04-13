const crypto = require("crypto");
const _ = require("lodash");

const UserModel = require("../models/user.model");
const { BadRequestError, NotFoundError } = require("../utils/error.response");
const { publishDirectMessage } = require("../queues/auth.producer");
const { omit, isEmail } = require("../utils");
const config = require("../config");
const { signToken } = require("../helpers/jwt");
const {
	getUserByUsernameOrEmail,
	getUserByEmail,
	getUserByUsername,
	getUserByVerificationToken,
	getUserByPasswordResetToken,
	updateUserById,
} = require("../repositories/user.repo");
const { getOne } = require("../repositories/factory.repo");
const { Types } = require("mongoose");
const { generateOtp } = require("../repositories/otp.repo");
const EXCHANGE_AUTH = "travel-auth";
const ROUTING_AUTH = "auth";
const OTPModel = require("../models/otp.model");
const AuthRepository = require("../repositories/auth.repo");
const AuthUtils = require("../utils/auth.utils");
const authConfig = require("../config/auth.config");

class AuthService {
	static signup = async ({ username, email, password, passwordConfirm }) => {
		// Validate input
		AuthUtils.validateUsername(username);
		AuthUtils.validateEmail(email);
		AuthUtils.validatePassword(password);

		// Check if user exists
		const existingUser = await AuthRepository.findUserByEmailOrUsername(email);
		if (existingUser) {
			throw new BadRequestError("Username or email already exists");
		}

		// Create user
		const verificationToken = AuthUtils.generateToken();
		const user = await AuthRepository.createUser({
			username,
			email,
			password,
			passwordConfirm,
			emailVerificationToken: verificationToken,
			role: authConfig.ROLES.USER
		});

		// Send verification email
		const verificationLink = `${authConfig.EMAIL.VERIFICATION_LINK}${verificationToken}`;
		await this.sendEmail({
			receiver: user.email,
			template: "verifyEmail",
			data: { verifyLink: verificationLink }
		});

		// Generate token and update last sign in
		const token = signToken({
			id: user._id,
			role: user.role
		});

		await AuthRepository.updateUser(user._id, {
			lastSignInAt: Date.now()
		});

		return {
			user: AuthUtils.sanitizeUser(user),
			accessToken: token
		};
	};

	static login = async ({ email, password }) => {
		// Find user by email or username
		const user = await AuthRepository.findUserByEmailOrUsername(email);
		if (!user) {
			throw new BadRequestError("Invalid username or email");
		}

		// Validate password
		if (!(await user.correctPassword(password))) {
			throw new BadRequestError("Incorrect password");
		}

		// Check if user is active
		if (!user.isActive) {
			throw new BadRequestError("User was banned");
		}

		// Generate token and update last sign in
		const token = signToken({
			id: user._id,
			role: user.role
		});

		await AuthRepository.updateUser(user._id, {
			lastSignInAt: Date.now()
		});

		return {
			user: AuthUtils.sanitizeUser(user),
			accessToken: token
		};
	};

	static verifyEmail = async (token) => {
		const user = await AuthRepository.findUserByVerificationToken(token);
		if (!user) {
			throw new BadRequestError("Verification token is invalid or has expired");
		}

		await AuthRepository.updateUserVerification(user._id);
		return {
			user: AuthUtils.sanitizeUser(user)
		};
	};

	static forgotPassword = async (email) => {
		const user = await AuthRepository.findUserByEmail(email);
		if (!user) {
			throw new NotFoundError("User does not exist");
		}

		// Generate reset token
		const resetToken = AuthUtils.generateToken();
		const resetExpires = Date.now() + authConfig.PASSWORD.RESET_EXPIRES_IN;

		// Update user with reset token
		await AuthRepository.updateUser(user._id, {
			passwordResetToken: resetToken,
			passwordResetExpires: resetExpires
		});

		// Send reset password email
		const resetLink = `${authConfig.EMAIL.RESET_PASSWORD_LINK}${resetToken}`;
		await this.sendEmail({
			receiver: user.email,
			template: "forgotPassword",
			data: {
				resetLink,
				username: user.username
			}
		});
	};

	static resetPassword = async ({ token, password, passwordConfirm }) => {
		// Validate password
		const randomBytes = await Promise.resolve(crypto.randomBytes(10));
		const randomCharacters = randomBytes.toString("hex");
		const tokenExpiration = Date.now() + 10 * 60 * 1000;
		existUser.passwordResetToken = randomCharacters;
		existUser.passwordResetExpires = tokenExpiration;
		await existUser.save({ validateBeforeSave: false });

		const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;
		const messageDetails = {
			receiver: existUser.email,
			resetLink,
			username: existUser.username,
			template: "forgotPassword",
		};

		const channel = await require("../server").channel;
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static changePassword = async (userId, payload) => {
		const { currentPassword, newPassword, newPasswordConfirm } = payload;
		const userExisting = await getOne(
			UserModel,
			{
				_id: new Types.ObjectId(userId),
			},
			false,
		);
		if (!userExisting) throw new NotFoundError("Not found user");
		const match = await userExisting.correctPassword(currentPassword);
		if (!match) throw new BadRequestError("Current password is incorrect");
		userExisting.password = newPassword;
		userExisting.passwordConfirm = newPasswordConfirm;
		await userExisting.save();
		const token = signToken({
			id: userExisting._id,
			role: userExisting.role,
		});

		return {
			user: { ...omit(userExisting.toObject(), ["password"]) },
			accessToken: token,
		};
	};

	static resetPassword = async ({ token, password, passwordConfirm }) => {
		const user = await getUserByPasswordResetToken(token);
		if (!user) throw new BadRequestError("Token is invalid or has expired");

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: true });

		const messageDetails = {
			username: user.username,
			template: "resetPasswordSuccess",
		};
		const channel = await require("../server").channel;
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static sendVerification = async (user) => {
		const randomBytes = await Promise.resolve(crypto.randomBytes(10));
		const randomCharacters = randomBytes.toString("hex");
		user.emailVerificationToken = randomCharacters;
		await user.save({ validateBeforeSave: false });

		const channel = await require("../server").channel;
		const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${user.emailVerificationToken}`;
		const messageDetails = {
			verifyLink: verificationLink,
			receiver: user.email,
			template: "verifyEmail",
		};
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static banUser = async (userId) => {
		const user = await updateUserById({
			userId,
			update: {
				isActive: false,
			},
		});
		if (!user) throw new NotFoundError("User does not exist");
		return _.pick(user.toObject(), ["_id", "email", "username", "isActive"]);
	};

	static unBanUser = async (userId) => {
		const user = await updateUserById({
			userId,
			update: {
				isActive: true,
			},
		});
		if (!user) throw new NotFoundError("User does not exist");
		return omit(user.toObject(), ["password"]);
	};

	static resetPasswordMobile = async ({
		email,
		password,
		passwordConfirm,
		otp,
	}) => {
		const user = await UserModel.findOne({ email });
		if (!user) throw new BadRequestError("User does not exist");

		const otpExist = await OTPModel.findOne({ email, otp });
		if (!otpExist) throw new BadRequestError("Invalid OTP code");

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		user.isVerifiedOTP = false;
		await user.save({ validateBeforeSave: true });

		return null;
	};
}

module.exports = AuthService;
