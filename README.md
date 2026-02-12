# Detroit #2 Club (d2lodge)

A modern, responsive web application for the Detroit #2 Club. Built with React and Vite, and hosted on Firebase.

## 🚀 Overview

This repository contains the source code for the Detroit #2 Club website. The site provides general information about the club, contact details, and information on how to pay dues.

### Key Features
- **Responsive Design**: Modern, mobile-first layout with a custom CSS theme.
- **Fast Performance**: Optimized builds using Vite 6.
- **State Management**: Centralized state management using Redux Toolkit.
- **Custom Hash Routing**: Lightweight client-side navigation using React hooks.
- **Firebase Hosting**: Fully configured for deployment to Firebase.
- **Google Sheets Integration**: Contact form submissions are saved to a Google Sheet via Google Apps Script.

---

## 🛠 Tech Stack

- **Language**: [JavaScript (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- **Framework**: [React 18](https://reactjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: Plain CSS with CSS variables
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Linting**: [ESLint](https://eslint.org/)

---

## 📂 Project Structure

```text
d2dues/
├── dist/               # Production build output
├── public/             # Static assets (favicons, etc.)
├── src/                # Application source code
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Individual page components
│   ├── App.css         # Main application styles
│   ├── App.jsx         # App shell and routing logic
│   ├── index.css       # Global/base styles
│   └── main.jsx        # React entry point
├── eslint.config.js    # ESLint configuration
├── firebase.json       # Firebase Hosting configuration
├── index.html          # Web entry point
├── package.json        # Project metadata and dependencies
└── vite.config.js      # Vite configuration
```

---

## 🚦 Getting Started

### Requirements
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (usually bundled with Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli) (only for deployment)

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

To expose the development server to your local network:
```bash
npm run devhost
```

---

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server. |
| `npm run devhost` | Starts the Vite development server and exposes it to the network. |
| `npm run build` | Compiles the application for production. |
| `npm run deploy` | Builds the project and deploys it to Firebase Hosting. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run preview` | Locally previews the production build. |

---

## 🌐 Environment Variables

The project uses the following environment variables for Firebase integration (add them to your `.env` file or deployment environment):

- `VITE_FIREBASE_API_KEY`: Your Firebase API key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID (e.g., `d2lodge`).
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID.
- `VITE_GOOGLE_SHEETS_URL`: Your Google Apps Script Web App URL.

---

## 🧪 Tests

- **TODO**: Implement unit and integration tests. No tests are currently present in the project.

---

## 🚀 Deployment

The project is configured for Firebase Hosting. To deploy:

1. Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and are logged in (`firebase login`).
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
This script will build the project (`vite build`) and then execute `firebase deploy`.

---

## ⚖️ License

- **TODO**: Add license information.
