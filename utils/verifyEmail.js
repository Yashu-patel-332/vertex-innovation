require('dotenv').config();
const { verifyEmailConnection } = require('./email');

(
    async () => {
    await verifyEmailConnection();
    console.log('SMTP connection verified. Contact notifications are ready to send.');
})().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
