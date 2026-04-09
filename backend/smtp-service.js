const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter without authentication for SMTP testing.
 * @param {Object} config - SMTP configuration
 * @param {string} config.host - SMTP host
 * @param {number} config.port - SMTP port
 * @param {string} config.encryption - Encryption type: 'none', 'ssl', 'tls'
 * @param {number} config.timeout - Connection timeout in ms
 */
const createTransporter = (config) => {
    const { host, port, encryption, timeout = 30000 } = config;

    const transporterOptions = {
        host,
        port,
        secure: encryption === 'ssl',
        requireTLS: encryption === 'tls',
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: timeout,
        greetingTimeout: timeout,
        socketTimeout: timeout,
        debug: true,
        logger: true
    };

    if (config.user && config.pass) {
        transporterOptions.auth = {
            user: config.user,
            pass: config.pass
        };
    }

    return nodemailer.createTransport(transporterOptions);
};

/**
 * Tests the connection to an SMTP server.
 */
const testConnection = async (config) => {
    const transporter = createTransporter(config);
    const startTime = Date.now();
    
    try {
        await transporter.verify();
        const duration = Date.now() - startTime;
        return {
            success: true,
            message: 'Connection successful',
            responseTime: duration,
            logs: [] // Logs are handled via the custom logger if needed
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            code: error.code,
            command: error.command
        };
    }
};

/**
 * Sends a single email.
 */
const sendEmail = async (config, emailData) => {
    const transporter = createTransporter(config);
    
    const mailOptions = {
        from: emailData.from,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        text: emailData.isHtml ? undefined : emailData.body,
        html: emailData.isHtml ? emailData.body : undefined,
        attachments: emailData.attachments || [],
        headers: emailData.headers || {}
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            response: info.response,
            envelope: info.envelope
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    testConnection,
    sendEmail
};
