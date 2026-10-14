# Implementation Plan - AI-Powered Email Analyzer & Keyword Generator

Building a clean, beginner-friendly MERN stack application with Generative AI capabilities to analyze email content, extract key structured information (keywords, summary, category, priority, action items, dates, times, people, organizations), and manage email history.

## User Review Required

> [!IMPORTANT]
> **Workspace Directory**: The project will be created inside `C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-email-analyzer`. Please set this directory as your active workspace if needed.
> 
> **LLM Provider Flexibility**: The backend will use `services/llmService.js` supporting standard LLM APIs (Google Gemini, Groq, Hugging Face, OpenAI-compatible APIs) controlled via environment variables (`LLM_API_KEY`, `LLM_PROVIDER`, `LLM_MODEL`). A built-in mock analyzer fallback is included if no API key is configured yet, ensuring 100% testability out of the box.

---

## Proposed Project Architecture & Folder Structure

```text
ai-email-analyzer/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection setup
│   ├── controllers/
│   │   └── emailController.js   # Request handlers for analyze, history, getById, delete
│   ├── middleware/
│   │   └── errorMiddleware.js   # Centralized Express error handler
│   ├── models/
│   │   └── emailModel.js        # Mongoose Schema for stored email analysis
│   ├── routes/
│   │   └── emailRoutes.js       # Express Router mapping paths to controllers
│   ├── services/
│   │   └── llmService.js        # LLM integration, prompt engineering, JSON extraction
│   ├── .env                     # Backend environment configuration
│   ├── .env.example             # Example environment file template
│   ├── package.json             # Backend dependencies (express, mongoose, dotenv, cors, axios)
│   └── server.js                # Express app entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar (Header)
    │   │   ├── EmailForm.jsx     # Email input form (Subject, Body, Char Count, Controls)
    │   │   ├── AnalysisResult.jsx# Visual dashboard card displaying AI extraction results
    │   │   ├── KeywordList.jsx   # Keyword badge component
    │   │   └── Loading.jsx       # Animated loading spinner & state message
    │   ├── pages/
    │   │   ├── AnalyzeEmail.jsx  # Main page containing form & results
    │   │   ├── History.jsx       # Email history page with cards/table & actions
    │   │   └── EmailDetails.jsx  # Detailed view page for a specific saved email analysis
    │   ├── services/
    │   │   └── emailService.js   # Axios client for communicating with Express backend
    │   ├── App.jsx               # React Router layout & navigation setup
    │   ├── main.jsx              # React Vite root render entry
    │   └── index.css             # Modern custom CSS styling system (responsive, modern dark/light card aesthetics)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Step-by-Step Development Plan

### Step 1: Workspace & Base Directory Setup
- Create project folder `ai-email-analyzer` inside `C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-email-analyzer`.
- Initialize `backend/package.json` and `frontend` (via Vite React JS template).

### Step 2: Backend Core Setup (`backend/`)
- Install backend packages: `express`, `mongoose`, `dotenv`, `cors`, `axios`.
- Setup `backend/config/db.js` with Mongoose connection logic and friendly error messages.
- Setup `backend/middleware/errorMiddleware.js` for structured JSON error responses `{ success: false, message: "..." }`.
- Create `backend/server.js` with CORS, express JSON parser, route listener, and error middleware.

### Step 3: MongoDB Model (`backend/models/emailModel.js`)
- Define `Email` schema:
  - `subject`: String (optional)
  - `body`: String (required)
  - `keywords`: [String]
  - `summary`: String
  - `category`: String (Job, Meeting, Education, Finance, Shopping, Personal, Marketing, Notification, Other)
  - `priority`: String (High, Medium, Low)
  - `action_items`: [String]
  - `date`: String
  - `time`: String
  - `people`: [String]
  - `organizations`: [String]
  - `createdAt`: Date (default: Date.now)

### Step 4: LLM Service & Prompt Engineering (`backend/services/llmService.js`)
- Implement `analyzeEmail(subject, body)` function.
- Create strict system/user prompt enforcing valid JSON output with keys: `keywords`, `summary`, `category`, `priority`, `action_items`, `date`, `time`, `people`, `organizations`.
- Parse JSON safely, sanitize response (removing markdown codeblocks if any), validate all expected fields, and provide fallback defaults for missing attributes.
- Include informative error handling for rate limits, invalid JSON, and missing API keys.

### Step 5: Email Controller & API Routes (`backend/controllers/` & `routes/`)
- `POST /api/email/analyze`: Validate request body -> call `llmService` -> create document in MongoDB -> return `{ success: true, data: savedEmail }`.
- `GET /api/email/history`: Fetch all saved analyses sorted by `createdAt` descending.
- `GET /api/email/:id`: Fetch single saved analysis by ID.
- `DELETE /api/email/:id`: Delete saved analysis by ID.

### Step 6: Frontend Core Setup (`frontend/`)
- Create React app with Vite.
- Install `axios`, `react-router-dom`.
- Setup clean CSS design system in `src/index.css` with responsive layout, badges, gradient headers, shadow cards, and clean typography.

### Step 7: Frontend Services & Components (`src/services/` & `src/components/`)
- `emailService.js`: API helper methods for `analyzeEmail`, `getHistory`, `getAnalysisById`, `deleteAnalysis`.
- `Navbar.jsx`: Brand title + links (`Analyze Email`, `History`).
- `EmailForm.jsx`: Text inputs, subject, body, character counter, Clear button, submit validation.
- `KeywordList.jsx`: Styled tag/pill rendering for extracted keywords.
- `AnalysisResult.jsx`: Grid/card layout showing Category badge, Priority badge, Summary, Action items checklist, Date, Time, People, Organizations, and Save/History actions.
- `Loading.jsx`: Modern loading animation with context messages ("AI is reading your email...", "Extracting action items...").

### Step 8: Frontend Pages & Routing (`src/pages/` & `App.jsx`)
- `AnalyzeEmail.jsx`: Combines input form, loading state, error alert banner, and analysis result cards.
- `History.jsx`: Displays saved email analyses list with category badges, date, short summary, view button, delete button.
- `EmailDetails.jsx`: Full-page view for viewing a historical email analysis by ID.
- `App.jsx`: Configures React Router routes (`/`, `/analyze`, `/history`, `/history/:id`).

### Step 9: Documentation & Verification
- Test all API endpoints with sample emails (Job interview, Meeting invitation, College announcement, Shopping order, Finance, Personal, Marketing).
- Create `README.md` with complete installation, architecture diagram, flow explanation, API documentation, and beginner guide.

---

## Verification Plan

### Automated & Manual API Tests
- Send HTTP `POST /api/email/analyze` with sample emails using `curl` / node script.
- Verify status code `200` and response structure `{ success: true, data: { keywords, summary, category, priority, ... } }`.
- Verify input validation: `POST /api/email/analyze` with empty body yields status code `400` `{ success: false, message: "Email body is required" }`.
- Verify database storage: `GET /api/email/history` returns array of analyses.
- Test `DELETE /api/email/:id` removes entry from MongoDB.

### Frontend UI Verification
- Test interactive flow in Vite dev server: paste sample text -> click Analyze Email -> verify loading state -> check rendered badges, summary, action items -> click History -> view historical record -> delete historical record.
