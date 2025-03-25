import LoginPage from "./components/Auth/Login";
import RegisterPage from "./components/Auth/Register";
import Navbar from "./components/Navbar";
import AboutPage from "./components/pages/about/AboutPage";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import EmployerDashboard from "./components/pages/employer/EmployerDashboard";
import FrontPage from "./components/pages/FrontPage";
import JobSearchPage from "./components/pages/jobPages/JobSearchPage";
import JobSeekerDashboard from "./components/pages/jobSeeker/JobSeekerDashboard";
import { Routes, Route } from 'react-router-dom';
import ProfilePage from "./components/Profile/Profile";
import JobApplyPage from "./components/Job/JobApply";
import { Toaster } from "react-hot-toast";
import Notification from "./components/notification/Notification";
import Message from "./components/message/Message";
import JobApplicants from "./components/pages/JobApplicants";


function App() {
  const role = localStorage.getItem('role');
  return (
    <>
      <Toaster/>
      <Navbar/>
      <Routes>
        <Route path="/" element={
            role == 'admin' ? <AdminDashboard/> : role == 'employer' ? <EmployerDashboard/>: role == 'jobseeker' ? <JobSeekerDashboard/> : <FrontPage/>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route path="/jobseeker" element={<JobSeekerDashboard />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/jobapply/:jobId" element={<JobApplyPage />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/message" element={<Message />} />
      </Routes>

    </>
  );
}

export default App;