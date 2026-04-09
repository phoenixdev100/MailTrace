<h1 align="center"><b>MailTrace — SMTP Testing Tool</b></h1>

<p align="center">
  <b>A professional-grade, professional-developer-focused suite for SMTP testing, email verification, and delivery analysis.</b>
</p>

---

<p align="center">
  <img src="frontend/src/assets/favicon.png" alt="MailTrace Hero" width="600px" style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
</p>

<h2 align="center"><b>🚀 Introduction</b></h2>

**MailTrace** is a comprehensive tool designed to streamline the process of testing SMTP configurations and email delivery workflows. Whether you are a developer debugging a mail server or a system administrator verifying delivery routes, MailTrace provides a high-fidelity environment to ensure your emails reach their destination exactly as intended.

---

<h2 align="center"><b>✨ Key Features</b></h2>

- **🛠️ Multi-Profile SMTP Configuration**
  - Save and manage multiple SMTP server profiles (Host, Port, SSL/TLS).
  - Support for authenticated sessions with modular security options.

- **📧 Advanced Email Composer**
  - **Single & Bulk Sending**: Test how your server handles different loads.
  - **Rich Text Support**: Full toolbar for <b>Bold</b>, <i>Italic</i>, and links.
  - **Code Integration**: Built-in code editor supports 20+ languages for payload testing.
  - **Multimedia Attachments**: Seamlessly attach PDFs, images, and other file types.

- **🗂️ Email Templates & Contacts**
  - Save standard test drafts as templates for rapid reuse.
  - Maintain a contact book for frequent test recipients.

- **📊 Real-time Logs & Analytics**
  - Live visibility into SMTP conversations and server handshakes.
  - Success/Failure distribution charts to track server performance over time.

- **🎨 Premium UI/UX**
  - A modern, "Strictly White" aesthetic that is clean, professional, and fully responsive.

---

<h2 align="center"><b>💻 Tech Stack</b></h2>

MailTrace is built using a modern, performant stack:

- **Frontend**: [React](https://reactjs.org/) (Powered by [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Email Engine**: [Nodemailer](https://nodemailer.com/)
- **Charts**: [Recharts](https://recharts.org/) or similar integration for data visualization.

---

<h2 align="center"><b>⚙️ Installation & Setup</b></h2>

<h3 align="center"><b>Prerequisites</b></h3>

<p align="center">
  Node.js (v16 or higher) | npm or yarn
</p>

<h3 align="center"><b>1. Backend Setup</b></h3>

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```
<p align="center">The backend will run at <code>http://localhost:3001</code>.</p>

<h3 align="center"><b>2. Frontend Setup</b></h3>

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
<p align="center">The frontend will be accessible at <code>http://localhost:5173</code>.</p>

---

<h2 align="center"><b>📡 API Endpoints</b></h2>

MailTrace exposes a clean API for triggering test actions programmatically:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/test-connection` | `POST` | Validates SMTP credentials and connectivity. |
| `/api/send-email` | `POST` | Handles single or bulk email dispatch with attachments. |
| `/health` | `GET` | Returns the health status of the backend engine. |

---

<h2 align="center"><b>🔍 Project Structure</b></h2>

```text
smtp-testing-tool/
├── backend/            # Express server & SMTP logic
│   ├── index.js        # Main entry point
│   └── smtp-service.js # Nodemailer implementation
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI pieces
│   │   ├── pages/      # Route-level components
│   │   └── assets/     # Images and static files
│   └── tailwind.config.js
└── README.md           # Project documentation
```

---

<h2 align="center"><b>🛡️ Privacy & Security</b></h2>

- **Local Storage**: All your SMTP configurations, contact lists, and templates are stored strictly in your browser's local storage.
- **Data Privacy**: No connection details or email contents are stored on our servers. The backend acts only as a relay to your specified SMTP host.

---

<h2 align="center"><b>📝 Contribution</b></h2>

Contributions are welcome! If you have suggestions for new features or find a bug, please open an issue or submit a pull request.

---

<h2 align="center"><b>⚖️ License</b></h2>

<p align="center">
  This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.
</p>

---

<p align="center">
  <b>Developed by Deepak</b><br>
  © 2026 Deepak | <a href="https://github.com/phoenixdev100">Github Profile</a>
</p>
