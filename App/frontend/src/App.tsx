import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./Style/app.css";
import LoginForm from "./components/auth/loginForm";

import RegisterForm from "./components/auth/registerForm";

import CreateProfile from "./components/User/Profile/CreateProfile";
import { AuthContext } from "./components/auth/AuthContext";
import  { useContext } from "react";
import NavBar from "./components/Nav/NavBar";
import Dashboard from "./components/User/Dashboard";
import DisplayProfile from "./components/User/Profile/DisplayProfile";
import Footer from "./components/Footer/Footer";
import TC from "./components/User/TC";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Router>
        <NavBar />
        <main>
        {/* Public Routes */}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/tc" element={<TC/>} />

          {/* Protected Routes */}

          <Route
            path="/createprofile"
            element={user ? <CreateProfile /> : <Navigate to="/login" />}
          />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/displayprofile"
            element={user ? <DisplayProfile /> : <Navigate to="/login" />}
          />

          {/* Default Route */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
