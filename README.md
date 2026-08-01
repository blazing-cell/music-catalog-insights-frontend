# TuneInsights — Frontend

TuneInsights is a modern music discovery and personal music library application built with Next.js and TypeScript.

The application allows users to search for songs, save songs to their personal library, view music analytics, and receive AI-powered music recommendations based on their saved library.

## Live Application

**Frontend:** https://music-catalog-insights-frontend.vercel.app/

**Backend API:** https://music-catalog-insights-backend-3uly.onrender.com

---

## Features

* User registration and login
* JWT-based authentication
* Secure user sessions
* Music search using the backend music catalog integration
* Add songs to a personal library
* Remove songs from the library
* Personal music library management
* Music analytics and insights
* AI-powered personalized music recommendations
* User profile management
* Password reset functionality
* Responsive design for desktop and mobile devices
* Toast notifications for user actions
* Mobile-friendly navigation sidebar

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React
* Recharts
* Sonner
* Vercel

---

## Project Structure

```text
frontend/
│
├── app/
│   ├── ai/
│   ├── analytics/
│   ├── library/
│   ├── login/
│   ├── profile/
│   ├── register/
│   ├── settings/
│   ├── forgot-password/
│   ├── reset-password/
│   │
│   ├── components/
│   │   └── dashboard.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Environment Variables

Create a `.env.local` file in the frontend project.

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production deployment on Vercel:

```env
NEXT_PUBLIC_API_URL=https://music-catalog-insights-backend-3uly.onrender.com
```

The frontend uses this variable to communicate with the Spring Boot backend.

### Important

Do not commit `.env.local` or other files containing private credentials to GitHub.

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/blazing-cell/music-catalog-insights-frontend
```

### 2. Navigate to the project

```bash
cd frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## Backend Integration

The frontend communicates with the Spring Boot backend through the `NEXT_PUBLIC_API_URL` environment variable.

The production backend is hosted on Render:

https://music-catalog-insights-backend-3uly.onrender.com

The frontend sends requests to backend endpoints for:

* User authentication
* User registration
* Password reset
* Song search
* Library management
* Analytics
* AI recommendations

JWT tokens are stored on the client and included in authenticated API requests using the `Authorization` header.

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Flow

The application uses JWT-based authentication.

```text
User
 │
 │ Login
 ▼
Next.js Frontend
 │
 │ POST /users/login
 ▼
Spring Boot Backend
 │
 │ Validate credentials
 ▼
JWT Token
 │
 ▼
Frontend
 │
 │ Store token
 ▼
Authenticated API Requests
```

When the user logs out:

* JWT token is removed
* Stored user information is removed
* Authentication cookie is cleared
* User is redirected to the login page

---

## AI Recommendations

The AI Insights section allows users to receive personalized music recommendations based on the songs stored in their personal library.

The frontend sends a request to the backend, which processes the user's library and uses the Groq API to generate recommendations.

```text
User Library
     │
     ▼
Spring Boot Backend
     │
     ▼
Groq AI
     │
     ▼
Personalized Recommendations
     │
     ▼
Next.js Frontend
```

---

## Responsive Design

TuneInsights is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The application includes a responsive sidebar navigation that changes behavior based on screen size.

On smaller screens, the navigation can be opened and closed using a mobile menu.

---

## Deployment

The frontend is deployed using Vercel.

Production URL:

https://music-catalog-insights-frontend.vercel.app/

The application is connected to the GitHub repository, allowing new changes to be automatically deployed when pushed to the configured branch.

---

## Design Decisions

### Next.js

Next.js was selected because it provides:

* React-based development
* File-based routing
* Production-ready builds
* Easy Vercel deployment
* Good support for modern frontend applications

### TypeScript

TypeScript was used to improve:

* Type safety
* Code maintainability
* Developer experience
* Error detection during development

### Tailwind CSS

Tailwind CSS was used to create a responsive and consistent UI without maintaining large custom CSS files.

### Recharts

Recharts was used to display music analytics and visualizations.

### Client-side JWT Storage

JWT authentication is handled on the frontend and sent to the backend through authenticated requests.

This approach keeps the backend stateless and allows the Spring Boot API to validate each authenticated request independently.

---

## Trade-offs

### Client-side JWT Handling

**Advantages:**

* Simple implementation
* Stateless backend authentication
* Easy integration with REST APIs

**Trade-off:**

Token storage on the client requires careful handling to reduce security risks such as XSS attacks.

### Separate Frontend and Backend Deployment

The frontend and backend are deployed independently.

**Advantages:**

* Independent deployments
* Easier scaling
* Frontend can be deployed through Vercel
* Backend can be deployed through Render

**Trade-off:**

Cross-Origin Resource Sharing (CORS) configuration is required between the frontend and backend.

### External AI API

The application uses the Groq API for AI-powered recommendations.

**Advantages:**

* No need to host a large AI model
* Faster implementation
* Reduced infrastructure requirements

**Trade-off:**

The application depends on an external AI service and its API availability and usage limits.

---

## Future Improvements

Possible future improvements include:

* Improved recommendation algorithms
* More advanced analytics
* Music listening history
* Playlist creation
* Social sharing
* Better AI recommendation filtering
* Secure HttpOnly cookie-based authentication
* Automated CI/CD testing
* Improved caching
* Advanced music discovery features

---

## License

This project was developed as a personal full-stack application project for learning and demonstration purposes.
