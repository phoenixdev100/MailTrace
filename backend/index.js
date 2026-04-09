require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { testConnection, sendEmail } = require('./smtp-service');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for attachments (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes

/**
 * Test SMTP connection
 */
app.post('/api/test-connection', async (req, res) => {
    const { config } = req.body;

    if (!config || !config.host || !config.port) {
        return res.status(400).json({ success: false, message: 'Invalid SMTP configuration' });
    }

    try {
        const result = await testConnection(config);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Send single/bulk email
 */
app.post('/api/send-email', upload.array('attachments'), async (req, res) => {
    const { config, emailData } = req.body;

    // Parse JSON strings if they were sent as part of multipart/form-data
    const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
    const parsedEmailData = typeof emailData === 'string' ? JSON.parse(emailData) : emailData;

    if (!parsedConfig || !parsedEmailData) {
        return res.status(400).json({ success: false, message: 'Missing config or email data' });
    }

    // Attachments processing
    const attachments = req.files ? req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer
    })) : [];

    parsedEmailData.attachments = attachments;

    try {
        const result = await sendEmail(parsedConfig, parsedEmailData);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            code: error.code,
            command: error.command
        });
    }
});

/**
 * Root route
 */
app.get('/', (req, res) => {
    res.json({
        name: 'MailTrace Backend API',
        version: '1.0.0',
        status: 'online'
    });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
