# Survey Application

This project is a full-stack survey application, designed to allow users to create, manage, and respond to surveys, with an administrative dashboard for analytics. It is built as a monorepo, separating the backend API from the frontend user interface.

## Features

### Backend
*   **User Authentication:** Secure user registration and login using JWTs.
*   **Survey Management:** API endpoints for creating, retrieving, updating, and deleting surveys.
*   **Response Collection:** API endpoints for submitting and retrieving survey responses.
*   **Role-Based Access Control:** Differentiates between regular users and administrators.
*   **Security:** Implements Helmet for security headers, CORS for cross-origin requests, and rate limiting to prevent abuse (100 requests per 15 minutes).
*   **Health Check:** A dedicated endpoint to monitor API health.
*   **Modular Architecture:** Feature-based modular architecture for better organization and maintainability.
*   **Input Validation:** Robust input validation using Zod.
*   **Spam Prevention:** Mechanisms to prevent excessive submissions (e.g., max 3 submissions per hour per IP).
*   **Conditional Question Logic:** Support for conditional display of questions based on previous answers.
*   **Analytics for Survey Responses:** Backend processing for survey analytics.
*   **Pagination Support:** For listing surveys and responses.
*   **Graceful Error Handling:** Centralized error handling middleware.

### Frontend
*   **Survey Builder:** Create dynamic surveys with multiple question types (text, radio, checkbox, rating) using a drag-and-drop interface.
*   **Conditional Logic:** Show/hide questions based on previous answers.
*   **Response Collection:** Clean, user-friendly survey forms for participants.
*   **Analytics Dashboard:** Visualize survey responses with charts (Recharts) and detailed data.
*   **Modern UI:** Clean, minimal design with Shadcn UI components built on Radix UI for accessibility and customizability.
*   **Responsive Design:** Mobile-first design ensuring usability across various devices.
*   **Protected Routes:** Ensures only authenticated and authorized users can access specific parts of the application.
*   **State Management:** Efficient global state management using Zustand.
*   **Data Fetching:** Optimized data fetching and caching with React Query and Axios.

## Technologies Used

### Backend
*   **Language:** TypeScript
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** `bcryptjs` (password hashing), `jsonwebtoken` (JWTs)
*   **Validation:** `zod`
*   **Middleware:** `helmet`, `cors`, `express-rate-limit`
*   **Development:** `tsx` (for running TypeScript directly)

### Frontend
*   **Language:** TypeScript
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, PostCSS
*   **UI Components:** Radix UI, Shadcn UI
*   **Routing:** `react-router-dom`
*   **State Management:** `zustand`
*   **Data Fetching:** `axios`, `@tanstack/react-query`
*   **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
*   **Icons:** `@phosphor-icons/react`, `lucide-react`
*   **Forms:** `react-hook-form`, `@hookform/resolvers`
*   **Charting:** `recharts`

## Architecture Decisions

*   **Monorepo Structure:** The project is organized into `backend` and `frontend` directories within a single repository. This simplifies development setup, code sharing (e.g., types), and deployment for a unified team.
*   **RESTful API:** The backend exposes a RESTful API, providing clear, stateless communication between the frontend and backend.
*   **Modular Backend:** The backend is structured into feature-specific modules (e.g., `auth`, `survey`, `response`), each containing its own routes, controllers, services, and models. This promotes separation of concerns and maintainability.
*   **MongoDB with Mongoose:** Chosen for its flexibility with schema design, rapid development capabilities, and strong community support, suitable for a survey application where data structures might evolve.
*   **JWT Authentication:** JSON Web Tokens are used for stateless authentication, allowing the backend to verify user identity without session storage.
*   **React with Vite:** React provides a component-based architecture for building dynamic user interfaces, while Vite offers an extremely fast development experience and optimized builds.
*   **Tailwind CSS & Shadcn UI:** Tailwind CSS enables rapid UI development with utility-first styling, and Shadcn UI (built on Radix UI) provides accessible, customizable, and unstyled components that integrate seamlessly with Tailwind.
*   **Zustand for State Management:** A lightweight and flexible state management solution for React, chosen for its simplicity and performance.
*   **React Query for Data Fetching:** Manages server state, caching, and synchronization, significantly improving the user experience by reducing loading states and optimizing API calls.
*   **Protected Routes (Frontend):** Implemented using `react-router-dom` to enforce authentication and authorization checks before rendering specific components, enhancing security and user experience.

## Assumptions and Trade-offs

### Assumptions
*   **Development Environment:** Users are assumed to have Node.js (v18+) and npm/yarn installed.
*   **Database Availability:** A MongoDB instance is expected to be accessible to the backend, either locally (e.g., via Docker) or remotely.
*   **Environment Variables:** Proper configuration of `.env` files for both backend and frontend is crucial for the application to function correctly.
*   **Client-Side Authentication:** JWTs are stored in `localStorage` on the client-side. While common, this approach is susceptible to Cross-Site Scripting (XSS) attacks if the frontend is not adequately secured.

### Trade-offs
*   **Monorepo Complexity:** While beneficial for smaller teams, a monorepo can introduce complexity in build processes, dependency management, and CI/CD pipelines as the project scales significantly.
*   **MongoDB Schema Flexibility:** The schemaless nature of MongoDB offers development speed but requires diligent application-level validation (e.g., using Zod and Mongoose schemas) to maintain data integrity, especially in larger teams.
*   **Client-Side JWT Storage:** Storing JWTs in `localStorage` is simpler to implement than using HTTP-only cookies but carries a higher risk of XSS vulnerabilities. The current implementation prioritizes ease of use and development speed.
*   **Shadcn UI Customization:** Shadcn UI provides unstyled components, offering maximum customization. This requires more initial effort in styling compared to opinionated component libraries but results in a highly tailored and consistent design system.

## Setup Instructions

Follow these steps to get the application up and running on your local machine.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or Yarn
*   MongoDB (running locally or accessible remotely)

### 1. Clone the Repository

```bash
git clone https://github.com/SunilNeupane77/assignment.git
cd assignment
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and configure environment variables.

```bash
cd backend
npm install # or yarn install
```

Create a `.env` file in the `backend` directory based on `.env.example`:

```
# .env (in backend directory)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/survey-app
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173 # Frontend URL
```

Replace `your_jwt_secret_key` with a strong, random string. Adjust `MONGODB_URI` if your MongoDB instance is elsewhere.

### 3. Frontend Setup

Navigate to the `frontend` directory, install dependencies, and configure environment variables.

```bash
cd ../frontend
npm install # or yarn install
```

Create a `.env` file in the `frontend` directory based on `.env.example`:

```
# .env (in frontend directory)
VITE_API_BASE_URL=http://localhost:5000/api
```

Adjust `VITE_API_BASE_URL` if your backend is running on a different port or domain.

### 4. Running the Application

First, start the backend server:

```bash
cd ../backend
npm run dev
```

Then, in a new terminal, start the frontend development server:

```bash
cd ../frontend
npm run dev
```

The frontend application should now be accessible at `http://localhost:5173` (or the port indicated by Vite).

## API Endpoints

### Backend API Endpoints

*   **POST** `/api/auth/register` - Register a new user
*   **POST** `/api/auth/login` - Authenticate user and get JWT
*   **POST** `/api/surveys` - Create a new survey (Admin only, requires JWT)
*   **GET** `/api/surveys/:id` - Get survey by ID
*   **GET** `/api/surveys?page=1&limit=10` - List all surveys with pagination
*   **POST** `/api/responses` - Submit a survey response
*   **GET** `/api/responses/:surveyId` - Get analytics for a survey (Admin only, requires JWT)
*   **GET** `/health` - Check server status

### Frontend Expected API Endpoints

The frontend interacts with the following endpoints:

*   `GET /api/surveys` - List all surveys
*   `GET /api/surveys/:id` - Get single survey
*   `POST /api/surveys` - Create survey
*   `PUT /api/surveys/:id` - Update survey
*   `DELETE /api/surveys/:id` - Delete survey
*   `POST /api/surveys/:id/responses` - Submit response
*   `GET /api/surveys/:id/responses` - Get all responses
*   `GET /api/surveys/:id/analytics` - Get survey analytics

## Usage

### Admin Dashboard

1.  Navigate to `/dashboard` after logging in as an administrator.
2.  View total surveys and responses.
3.  Quickly access options to create new surveys and view analytics.

### Creating a Survey

1.  From the Admin Dashboard, click "Create Survey".
2.  Enter the survey title and description.
3.  Add questions:
    *   Choose question type (text, radio, checkbox, rating).
    *   Enter question text.
    *   Add options for radio/checkbox questions.
    *   Mark as required if needed.
    *   Configure conditional logic if desired.
4.  Click "Save Survey".

### Taking a Survey

1.  Share the survey URL, typically in the format `/survey/{surveyId}`.
2.  Users can fill out the form and submit their responses.

### Viewing Analytics

1.  Navigate to `/dashboard/analytics` or click on a specific survey's analytics link.
2.  Select a survey to view its results.
3.  The dashboard will display:
    *   Total response count.
    *   Bar charts for multiple-choice questions.
    *   Average ratings for rating questions.
    *   A list of text responses.

## Development

### Code Quality (Frontend)

```bash
npm run lint
```

### Type Checking (Frontend)

```bash
npm run build
```
# assignment
