# HireMe - Job Portal

HireMe is a modern job portal application designed to connect job seekers with employers. It provides a seamless platform for job seekers to search and apply for jobs and for employers to post job listings and manage applications. Built with React for the frontend and Node.js/Express with MongoDB for the backend, HireMe offers a responsive, user-friendly experience with robust features.

## Features

### For Job Seekers
- **Job Search:** Search jobs by title, category, location, or type (e.g., remote, full-time).
- **Job Recommendations:** Personalized job suggestions based on user profile.
- **Application Management:** View applied jobs and their statuses (e.g., applied, shortlisted, rejected).
- **Messages:** Receive and manage messages from employers.
- **Resume Upload:** Upload and manage resumes for applications.

### For Employers
- **Job Posting:** Create and manage job listings with details like title, description, and salary range.
- **Applicant Management:** View, shortlist, or reject applications for posted jobs.
- **Dashboard:** Track job postings and applicant statistics.

### General
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **User Authentication:** Secure login and registration for job seekers and employers.
- **Dynamic Front Page:** Showcases featured jobs and categories.

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication

### Deployment
(Specify if deployed, e.g., Render, Vercel, etc.)

### Other Tools
- Git
- GitHub

## Project Structure

```
HireMe/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components (e.g., Footer)
│   │   ├── pages/            # Page components (e.g., FrontPage, JobSeekerDashboard)
│   │   ├── App.jsx           # Main app component with routing
│   │   ├── index.jsx         # Entry point
│   │   └── ...
│   ├── package.json          # Frontend dependencies
│   └── ...
├── backend/                  # Node.js/Express backend
│   ├── models/               # Mongoose models (e.g., Job, User, Application)
│   ├── routes/               # API routes (e.g., job.js, auth.js)
│   ├── controllers/          # Route handlers (e.g., jobController.js)
│   ├── middleware/           # Authentication and role middleware
│   ├── config/               # Configuration (e.g., database connection)
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── ...
├── README.md                 # This file
└── ...
```

## Prerequisites
- **Node.js**: v16.x or higher
- **MongoDB**: Local instance or MongoDB Atlas
- **npm**: For package management

## Installation

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the server directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hireme
   JWT_SECRET=your_jwt_secret_key
   ```
   Replace `MONGODB_URI` with your MongoDB connection string if using MongoDB Atlas.
4. Start the server:
   ```bash
   npm start
   ```
   Use `nodemon` for development:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000` by default.

## Running the Full Application
1. Ensure MongoDB is running locally or accessible via the URI.
2. Start the backend server first (`http://localhost:5000`).
3. Then start the frontend (`http://localhost:3000`).
4. The frontend communicates with the backend via API calls (e.g., `http://localhost:5000/api/...`).

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user (job seeker or employer).
- `POST /api/auth/login`: Log in and receive a JWT token.
- `GET /api/auth/profile`: Get authenticated user’s profile (requires token).

### Jobs
- `GET /api/job`: Fetch all approved jobs.
- `GET /api/job/:id`: Fetch a specific job by ID.
- `POST /api/job`: Create a new job (employer only).
- `PUT /api/job/:id`: Update a job (employer only).
- `DELETE /api/job/:id`: Delete a job and its applications (employer only).
- `GET /api/job/employer/jobs`: Fetch jobs posted by the employer.
- `GET /api/job/my-applications`: Fetch jobs applied to by the job seeker.

### Applications
- `POST /api/job/apply`: Apply to a job with resume and cover letter.
- `PUT /api/job/applications/:applicationId/shortlist`: Shortlist an application (employer only).
- `PUT /api/job/applications/:applicationId/reject`: Reject an application (employer only).

### Messages
- `GET /api/messages`: Fetch messages for the authenticated user.
- `PUT /api/messages/:messageId/read`: Mark a message as read.
- `DELETE /api/messages/:messageId`: Delete a message.

## Usage
- **Front Page:** Browse featured jobs, search jobs, or sign up as a job seeker/employer.
- **Job Seeker Dashboard:** Search and apply for jobs, view applications, and manage messages.
- **Employer Dashboard:** Post jobs, view applicants, and manage job listings.
- **Job Application:** Upload a resume and submit an application for a job.

## Screenshots
![Screenshot 2025-03-25 212240](https://github.com/user-attachments/assets/d87b2475-a092-4b2f-87e8-558c3a9c2662)
![Screenshot 2025-03-25 212256](https://github.com/user-attachments/assets/e696089b-a6de-4b25-b054-7e770f62ff3a)
![Screenshot 2025-03-25 212319](https://github.com/user-attachments/assets/b33fefcc-35a1-4d55-8585-23872e4201ee)
![Screenshot 2025-03-25 212338](https://github.com/user-attachments/assets/bfb211ef-3ca2-4f05-88ca-a95cca7c9bbb)
![Screenshot 2025-03-25 212350](https://github.com/user-attachments/assets/3c08f07f-cbab-483a-9cfa-ef0fcdf86d51)
![Screenshot 2025-03-25 212406](https://github.com/user-attachments/assets/2e2bf88b-2cf2-4a90-b686-39ddb8564416)
![Screenshot 2025-03-25 212421](https://github.com/user-attachments/assets/9c1a311f-b92b-4e62-8f89-8823d9f507e9)
![Screenshot 2025-03-25 212817](https://github.com/user-attachments/assets/094baab5-bbea-4a3d-b7a2-c0f3d583e138)
![Screenshot 2025-03-25 212847](https://github.com/user-attachments/assets/1d4530f8-c5b6-4894-b390-762f5f58e3a9)





## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## Known Issues
- (List any known bugs or limitations, e.g., "Search autocomplete not implemented yet.")
- Report issues in the GitHub Issues section.

## Future Enhancements
- Add job category filtering on the frontend.
- Implement real-time notifications for messages also the real time chating.
- Add real time chat assistance (ChatBot).


## Contact
For questions or support, reach out to `rk9032929@gmail.com` or open an issue on GitHub.
