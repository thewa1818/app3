import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/User/SignUp";
import Login from "./components/User/Login";
import UserHome from "./components/User/UserHome";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminSignUp from "./components/Admin/AdminSignUp";
import AdminHome from "./components/Admin/AdminHome";
import { Container, Box } from "@mui/material";
import AdminForm from "./components/Admin/AdminForm";
import FirstHome from "./components/FirstHome";

function App() {
  return (
    <Router>
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* 管理者用のルーティング */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/upload" element={<AdminForm />} />

            <Route path="/" element={<FirstHome />} />
            <Route path="/userhome" element={<UserHome />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
