<h1 align="center"><b>MailTrace — Frontend Client</b></h1>

<p align="center">
  <b>The user interface for the MailTrace SMTP testing suite, built with React, Vite, and Tailwind CSS.</b>
</p>

---

<h2 align="center"><b>🎨 Design Philosophy</b></h2>

The MailTrace UI is designed with a **"Strictly White"** aesthetic. It prioritizes clarity, whitespace, and professional typography to ensure a distraction-free environment for developers.

- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
- **Micro-animations**: Subtle transitions for a premium feel.
- **Glassmorphism**: Modern UI touches on overlays and sidebars.

---

<h2 align="center"><b>🛠️ Tech Stack</b></h2>

- **React 18**
- **Vite** (Dev Tooling)
- **Tailwind CSS v4** (Styling)
- **React Router Dom** (Navigation)
- **Lucide React** (Icons)
- **Recharts** (Visual Analytics)

---

<h2 align="center"><b>📂 Key Directories</b></h2>

- `src/components/`: Reusable UI components (Sidebar, Layout, Custom Inputs).
- `src/pages/`: Main application views (SMTP Config, Send Email, Logs, Analytics).
- `src/assets/`: Static assets and branding images.
- `src/index.css`: Global base styles and Tailwind directives.

---

<h2 align="center"><b>🚀 Quick Start</b></h2>

### **Initial Setup**
```bash
# Install dependencies
npm install
```

### **Development Mode**
```bash
# Run the dev server
npm run dev
```

### **Production Build**
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

---

<h2 align="center"><b>⚙️ Configuration</b></h2>

The frontend communicates with the backend via a base URL. Ensure your backend is running on the port specified in your API calls (default is `3001`).

---

<p align="center">
  <b>MailTrace UI v1.0.0</b>
</p>
