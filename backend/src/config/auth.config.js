const config = require("./index");

module.exports = {
	// JWT Configuration
	JWT: {
		SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
		EXPIRES_IN: "7d",
		REFRESH_TOKEN_EXPIRES_IN: "30d",
	},

	// Password Configuration
	PASSWORD: {
		SALT_ROUNDS: 10,
		MIN_LENGTH: 8,
		RESET_EXPIRES_IN: 10 * 60 * 1000, // 10 minutes
	},

	// Email Verification
	EMAIL: {
		VERIFICATION_EXPIRES_IN: 24 * 60 * 60 * 1000, // 24 hours
		VERIFICATION_LINK: `${config.CLIENT_URL}/confirm_email?v_token=`,
		RESET_PASSWORD_LINK: `${config.CLIENT_URL}/reset_password?token=`,
	},

	// OTP Configuration
	OTP: {
		LENGTH: 6,
		EXPIRES_IN: 5 * 60 * 1000, // 5 minutes
	},

	// RabbitMQ Configuration
	RABBITMQ: {
		EXCHANGE: "travel-auth",
		ROUTING_KEY: "auth",
	},

	// User Roles
	ROLES: {
		USER: "user",
		ADMIN: "admin",
		GUIDE: "guide",
	},

	// Default Values
	DEFAULTS: {
		NATIONALITY: "Việt Nam",
		PROFILE_PICTURE: config.PROFILE_PICTURE_DEFAULT,
	},
};
