const nodemailer = require('nodemailer');

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO_EMAIL'];

class EmailDeliveryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EmailDeliveryError';
        this.code = 'EMAIL_DELIVERY_FAILED';
    }
}

const getTransporter = () => {
    try {
         const missing = required.filter((key) => !process.env[key]);
    if (missing.length) {
        throw new EmailDeliveryError(`Email delivery is not configured. Missing: ${missing.join(', ')}.`);
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
             user: process.env.SMTP_USER, 
             pass: process.env.SMTP_PASS 
            },
            logger: true,
            debug: true 
    });

    } catch (error) {
        console.error("SMTP ERROR:", error);
        throw error;
    }
}

exports.verifyEmailConnection = async () => {
    try { 
        await getTransporter().verify(); 
    }
    catch (error) {
        if (error.code === 'EMAIL_DELIVERY_FAILED') throw error;
        throw new EmailDeliveryError('Unable to connect to the configured SMTP server. Check SMTP host, port, username, and app password.');
    }
};

exports.sendContactNotification = async (contact) => {
    const transporter = getTransporter();
    try {
        await transporter.sendMail({
            from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.CONTACT_TO_EMAIL,
            replyTo: contact.email,
            subject: `[Vertex Web] ${contact.subject}`,
            text: `New contact enquiry\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'Not provided'}\nSubject: ${contact.subject}\n\nMessage:\n${contact.message}`
        });
    } catch (error) {
       console.error("SMTP ERROR:", error.message);
       throw error;
    }
};

exports.verifyEmailConnection = async () => {
    const transporter = getTransporter();
    await transporter.verify();
    console.log("SMTP Connected Successfully");
};
