# MindMirror Backend API

## Overview
The MindMirror backend is a Node.js/Express API server that provides secure authentication, journal entry management, AI-powered cognitive distortion detection, and analytics for the MindMirror mental wellness platform.

## Features
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📝 **Journal Management** - CRUD operations for journal entries with rich metadata
- 🧠 **AI Analysis** - OpenAI GPT-4 powered cognitive distortion detection and reframing
- 📊 **Analytics** - Mood trends, distortion patterns, and progress tracking
- 🛡️ **Security** - Rate limiting, CORS, helmet, input validation
- 📈 **Scalable** - MongoDB with optimized queries and indexes

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **AI/NLP**: OpenAI GPT-4 API
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout user
- `DELETE /account` - Deactivate account

### Journal Entries (`/api/journal`)
- `POST /` - Create new journal entry
- `GET /` - Get journal entries (with pagination & filters)
- `GET /summary` - Get entries summary for dashboard
- `GET /:id` - Get specific journal entry
- `PUT /:id` - Update journal entry
- `DELETE /:id` - Delete journal entry
- `GET /tags/all` - Get all user tags

### AI Analysis (`/api/ai`)
- `POST /analyze/:entryId` - Analyze entry for cognitive distortions
- `POST /batch-analyze` - Batch analyze multiple entries
- `GET /distortions` - Get cognitive distortion information
- `GET /status` - Check AI service status
- `POST /reanalyze/:entryId` - Force re-analysis of entry

### Analytics (`/api/analytics`)
- `GET /mood-trends` - Get mood trends over time
- `GET /distortion-patterns` - Get cognitive distortion patterns
- `GET /writing-insights` - Get writing and journaling insights
- `GET /progress-tracking` - Get mental health progress indicators
- `GET /dashboard` - Get comprehensive dashboard data

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key for JWT tokens
   - `OPENAI_API_KEY` - Your OpenAI API key
   - Other configuration as needed

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mindmirror

# JWT Secret (generate a strong secret key)
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Encryption (for sensitive data)
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

## Data Models

### User Model
- Authentication credentials (username, email, password)
- Profile information (name, timezone, preferences)
- Account status and timestamps

### Journal Entry Model
- Entry content (title, content, mood, tags)
- AI analysis results (distortions, reframes, sentiment)
- Metadata (word count, reading time, edit history)
- Privacy and status flags

## AI Integration

The AI service uses OpenAI's GPT-4 to:
1. **Detect Cognitive Distortions** - Identifies 12 types of cognitive distortions
2. **Provide Reframes** - Suggests healthier thought patterns using CBT techniques
3. **Analyze Sentiment** - Determines overall emotional tone
4. **Extract Themes** - Identifies key topics and concerns

### Supported Cognitive Distortions
- All-or-Nothing Thinking
- Overgeneralization
- Mental Filter
- Disqualifying the Positive
- Jumping to Conclusions
- Magnification/Catastrophizing
- Emotional Reasoning
- Should Statements
- Labeling
- Personalization
- Comparison
- Blame

## Security Features
- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Configurable cross-origin requests
- **Helmet** - Sets security headers
- **Input Validation** - Comprehensive request validation
- **Password Security** - bcrypt hashing with salt rounds
- **JWT Authentication** - Secure token-based auth

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### Project Structure
```
server/
├── models/          # Mongoose models
├── routes/          # Express route handlers
├── middleware/      # Custom middleware
├── services/        # Business logic services
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── .env            # Environment variables
```

## Testing
API endpoints can be tested using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Deployment
The backend is designed to be deployed on platforms like:
- Render
- Railway
- Heroku
- AWS/GCP/Azure

Make sure to:
1. Set production environment variables
2. Use MongoDB Atlas for production database
3. Configure proper CORS origins
4. Set NODE_ENV=production

## Contributing
1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test your changes thoroughly

## License
MIT License - see LICENSE file for details