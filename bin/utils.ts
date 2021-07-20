const mailer = require('./mailer');
const jsBase64 = require('js-base64');
import { env } from './env';

export const utils = class Utils {
	static pre = '\\\\ad-vps-01\\'

	/**
	 * Parse the authorization values from the header
	 * @param authorization The authorization part of the header
	 * @returns The array of the auth credentials
	 */
	static getAuth(authorization: string): string[] {
		return jsBase64.decode(authorization.split(' ')[1]).split(':');
	}

	/**
	 * Check that the authorization passed matches the authorized users
	 * @param auth The auth credentials
	 * @returns If the credentials are valid
	 */
	static checkAuth(auth: string[]): boolean {
		return auth[0] === env.auth.user && auth[1] === env.auth.pass
	}

	/**
	 * Validate that the headers passed are present and valid
	 * @param headers The headers for the API call
	 * @returns If the headers contain the authorization header and the authorization is valid
	 */
	static validHeaders(headers): boolean {
		if (headers.authorization && headers.authorization.match(/^Basic\s.+/i)) {
			return this.checkAuth(this.getAuth(headers.authorization));
		} else {
			return false;
		}
	}

	/**
	 * Format the given string using the arguments passed
	 * @param formatString The string to use for the format
	 * @param args The format arguments to use
	 * @returns The formatted string
	 */
	static format(formatString: string, ...args: any[]): string {
		for (let i = 0; i < args.length; i++) {
			formatString = formatString.replace(`{${i}}`, args[i])
		}

		return formatString
	}

	/**
	 * Send the email containing the printer links
	 * @param printers List of printers to be sent
	 * @param email Email address of the person to receive them
	 */
	static sendPrinters(printers: string[], email: string): void {
		let message: string = '\\\\ad-vps-01\\ADMIN-IT';

		// Enumerate through the printers list to

		mailer.sendEmail(email, message);
	}
}

// module.exports = Utils;