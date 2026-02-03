import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./Sections/Home/HomePage.jsx";
import About from "./Sections/About/About.jsx";
import Tours from "./Sections/Tour/Tours.jsx";
import TourDetails from "./Sections/Tour/TourDetails.jsx";
import SignUp from "./components/SignUp/Signup.jsx";
import Signin from "./components/SignIn/Signin.jsx";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";
import AdminRoute from "./components/protectedRoute/AdminRoute.jsx";
import TourUploadForm from "./Sections/TourUpload/TourUploadForm.jsx";
import { AuthSuccess, ChangePassword, ForgotPassword, Verify, VerifyEmail, VerifyOTP } from "./pages";
import AdminPanel from "./Sections/AdminPanel/AdminPanel.jsx";
import Profile from "./Sections/Profile/Profile.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="verify/:token" element={<Verify />} />
        <Route path="/verify-otp/:email" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password/:email" element={<ChangePassword />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route
          path="/adminpanel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="/userprofile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tour-upload"
          element={
            <AdminRoute>
              <TourUploadForm />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
