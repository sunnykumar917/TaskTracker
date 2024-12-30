import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/authActions";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import { Toaster } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      dispatch(setUser(loggedInUser));
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/developer-dashboard"} />
              ) : (
                <Navigate to="/log-in" />
              )
            }
          />
          <Route path="/log-in" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
        </Routes>

        <Toaster richColors />
      </main>
    </Provider>
  );
}

export default App;
