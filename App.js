import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import PostList from "./pages/PostList";
import AdminDashboard from "./pages/AdminDashboard";
import EditPost from "./pages/EditPost";
import Schedule from "./pages/Schedule";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Authentication */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* User Pages */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/create"
                    element={<CreatePost />}
                />

                <Route
                    path="/posts"
                    element={<PostList />}
                />

                <Route
                    path="/edit/:id"
                    element={<EditPost />}
                />


                {/* Calendar */}

                <Route
                    path="/schedule"
                    element={<Schedule />}
                />


                {/* Admin */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;
