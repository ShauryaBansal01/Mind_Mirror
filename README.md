# MindMirror

MindMirror is a modern mental wellness journaling application that empowers users to track their moods, analyze cognitive patterns, and gain actionable insights through beautiful analytics and AI-driven recommendations.

## Features

- **Journaling:** Write daily entries to reflect on your thoughts and emotions.
- **Mood Tracking:** Log your mood and intensity for each entry.
- **Analytics Dashboard:** Visualize mood trends, mood distribution, weekly progress, and cognitive distortions with interactive charts.
- **AI Insights:** Receive personalized recommendations and insights based on your journaling data.
- **Authentication:** Secure login and registration system.
- **Responsive UI:** Clean, modern interface built with React, Tailwind CSS, and Recharts.

## Project Structure

```
MindMirror/
├── client/                # Frontend React app
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React context providers
│       ├── pages/         # App pages (analytics, auth, dashboard, journal, profile)
│       └── utils/         # Utility functions (API, helpers)
├── server/                # Backend Node.js/Express API
│   ├── middleware/        # Auth and validation middleware
│   ├── models/            # Mongoose models (User, JournalEntry)
│   ├── routes/            # API routes (auth, journal, analytics, ai)
│   └── services/          # AI and business logic services
└── package.json           # Project metadata and scripts
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/MindMirror.git
   cd MindMirror
   ```

2. **Install dependencies for both client and server:**
   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `server/` directory with your MongoDB URI and any required secrets.

4. **Run the development servers:**
   - In one terminal, start the backend:
     ```sh
     cd server
     npm run dev
     ```
   - In another terminal, start the frontend:
     ```sh
     cd client
     npm start
     ```

5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used
- **Frontend:** React, Tailwind CSS, Recharts, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **AI/Analytics:** Custom logic (see `server/services/aiService.js`)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

*MindMirror – Reflect. Analyze. Grow.*
