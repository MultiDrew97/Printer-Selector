const nodemailer = require('nodemailer');
import { env } from './env'

export const mailer = class {
	static sender = nodemailer.createTransport({
		service: 'outlook',
		auth: {
			user: env.emailing.user,
			pass: env.emailing.pass
		}
	})
	static sendEmail(email: string, contents: string) {
		console.debug(`Email: ${email}\nContents: ${contents}`);
	}
}

// module.exports = Mailer;