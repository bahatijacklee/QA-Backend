const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN;

const transport = Nodemailer.createTransport(
	MailtrapTransport({
		token: TOKEN,
	})
);

/**
 * Send an email using Mailtrap API
 * @param {Object} options - { to, subject, text, html, fromName, fromAddress }
 */
const sendEmail = async ({ to, subject, text, html, fromName, fromAddress }) => {
	const sender = {
		address: fromAddress || "hello@demomailtrap.co",
		name: fromName || "QA Dashboard",
	};
	const recipients = Array.isArray(to) ? to : [to];
	await transport.sendMail({
		from: sender,
		to: recipients,
		subject,
		text,
		html,
		category: "Transactional",
	});
};

module.exports = sendEmail;
