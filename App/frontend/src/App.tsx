 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/auth/loginForm";

import RegisterForm from "./components/auth/registerForm";

import CreateProfile from "./components/User/CreateProfile";
import {AuthContext} from "./components/auth/AuthContext";
import React, { useContext } from "react";
import NavBar from "./components/Nav/NavBar";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element= {<LoginForm />}/>
        <Route path="/register" element={<RegisterForm />} />
        
        <Route
          path="/createprofile"
          element={user ? <CreateProfile /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
