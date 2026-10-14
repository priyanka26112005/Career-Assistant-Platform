# ✉️ AI-Powered Email Analyzer & Keyword Generator

A clean, full-stack MERN (MongoDB, Express, React, Node.js) application integrated with a Large Language Model (LLM) API. The application analyzes raw email content, extracts key insights (summary, category, priority level, action items, dates, times, people, organizations), and generates meaningful keyword tags.

---

## 🌟 Key Features

1. **Email Input & Preset Testing**
   - Clean, responsive email form supporting custom Email Subject and Email Body text.
   - Live character counter with limit warning (10,000 characters).
   - 1-Click quick sample email buttons for instant testing (Job interview, Meeting invitation, Online order).

2. **Generative AI Analysis**
   - **Keywords**: Extracts key terms while avoiding irrelevant stop words.
   - **Executive Summary**: 1-2 sentence concise summary.
   - **Category Badge**: Classifies emails into `Job`, `Meeting`, `Education`, `Finance`, `Shopping`, `Personal`, `Marketing`, `Notification`, or `Other`.
   - **Priority Badge**: Evaluates urgency as `High`, `Medium`, or `Low`.
   - **Action Items Checklist**: Identifies actionable tasks required by the recipient.
   - **Extracted Entities**: Extracts mentioned dates, times, people, and organizations.

3. **History & Persistence**
   - Automatically stores email analyses in MongoDB (or graceful in-memory storage fallback if MongoDB service is offline).
   - Dedicated `/history` route to search, view full analysis details (`/history/:id`), and delete past email records.

4. **Beginner-Friendly Modular Architecture**
   - Strict separation of concerns (Routes -> Controllers -> LLM Service -> Database Model).
   - LLM integration is completely encapsulated inside `services/llmService.js`.
   - API secrets stored securely in `.env` and never exposed to the React frontend.

---

## 🏗️ Architecture & Data Flow

```text
User Input (React Frontend)
  │
  ▼
POST /api/email/analyze (Express Backend)
  │
  ▼
services/llmService.js (Constructs Prompt & Calls LLM API)
  │
  ▼
Generative AI Model (Returns Structured JSON)
  │
  ▼
JSON Cleaning & Schema Sanitization
  │
  ▼
MongoDB Database (Saves Analysis Document)
  │
  ▼
React Dashboard UI (Displays Extracted Cards & Badges)
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Bootstrapped with Vite)
- **Routing**: React Router v6 (`react-router-dom`)
- **HTTP Client**: Axios (`src/services/emailService.js`)
- **Styling**: Custom modern CSS system (Glassmorphic dark cards, curated HSL badges, Outfit & Inter fonts)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (CommonJS `require`)
- **Web Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Environment Handling**: `dotenv`
- **Security**: `cors` middleware, environment variable separation

### AI Integration
- **Service Layer**: `services/llmService.js`
- **Supported Providers**: Google Gemini API, Groq, OpenAI, Hugging Face, or OpenAI-compatible APIs.
- **Smart Fallback**: Includes a built-in rule-based NLP fallback analyzer if no API key is specified, ensuring 100% testability out of the box.

---

## 📁 Project Folder Structure

```text
ai-email-analyzer/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   └── emailController.js   # API request handlers
│   ├── middleware/
│   │   └── errorMiddleware.js   # Centralized Express error handler
│   ├── models/
│   │   └── emailModel.js        # Mongoose Schema for Email analysis
│   ├── routes/
│   │   └── emailRoutes.js       # Express Router endpoints
│   ├── services/
│   │   └── llmService.js        # LLM integration & prompt engineering
│   ├── testApi.js               # Automated backend test suite
│   ├── .env                     # Secrets & environment config
│   ├── .env.example             # Template for environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   ├── EmailForm.jsx     # Input form & sample preset buttons
    │   │   ├── AnalysisResult.jsx# Visual AI output dashboard
    │   │   ├── KeywordList.jsx   # Keyword badge component
    │   │   └── Loading.jsx       # Animated loading spinner
    │   ├── pages/
    │   │   ├── AnalyzeEmail.jsx  # Main analysis page
    │   │   ├── History.jsx       # Saved email history & search page
    │   │   └── EmailDetails.jsx  # Detailed analysis view
    │   ├── services/
    │   │   └── emailService.js   # Centralized Axios API service layer
    │   ├── App.jsx               # React Router config
    │   ├── main.jsx              # React DOM entry
    │   └── index.css             # Design tokens & styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local service or MongoDB Atlas connection string)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/email_analyzer
LLM_API_KEY=your_api_key_here
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
```

Start the backend development server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the Vite React frontend:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/email/analyze` | Analyzes email content via LLM and saves to database |
| `GET` | `/api/email/history` | Retrieves list of all saved email analyses |
| `GET` | `/api/email/:id` | Fetches single email analysis by ID |
| `DELETE` | `/api/email/:id` | Deletes an email analysis record by ID |

### Example Request (`POST /api/email/analyze`)
```json
{
  "subject": "Interview Confirmation",
  "body": "Dear Priyanka,\n\nYour technical interview has been scheduled for Tuesday at 11 AM.\n\nPlease bring your updated resume.\n\nRegards,\nHR Team"
}
```

### Example Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "_id": "66f123456789abcdef012345",
    "subject": "Interview Confirmation",
    "body": "Dear Priyanka...",
    "keywords": ["Technical Interview", "Tuesday", "11 AM", "Updated Resume"],
    "summary": "Technical interview scheduled for Tuesday at 11 AM.",
    "category": "Job",
    "priority": "High",
    "action_items": [
      "Attend technical interview",
      "Bring updated resume"
    ],
    "date": "Tuesday",
    "time": "11 AM",
    "people": ["Priyanka", "HR Team"],
    "organizations": [],
    "createdAt": "2026-09-22T16:00:00.000Z"
  }
}
```

---

## 🧠 LLM Service & Prompt Engineering Guide

The LLM integration logic resides exclusively inside `backend/services/llmService.js`.

### How Prompt Engineering Works
To guarantee that the LLM returns **only valid JSON** without markdown blocks or conversational text, we supply strict system instructions:

```text
You are an AI email analysis assistant.
Analyze the provided email and extract important information.
Return ONLY valid JSON with keys:
{
  "keywords": [],
  "summary": "",
  "category": "",
  "priority": "",
  "action_items": [],
  "date": "",
  "time": "",
  "people": [],
  "organizations": []
}
```

The response is stripped of code wrappers (` ```json `), parsed with `JSON.parse()`, validated, and normalized before returning to the controller.

---

## 🔮 Future Improvements
- Multi-language support for international emails.
- Batch email analysis upload (JSON / CSV file upload).
- User authentication (JWT) for individual history management.
