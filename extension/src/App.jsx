import { MemoryRouter, Routes, Route } from "react-router-dom"; // Memory router since extensions don't have browser history
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";
import AuthProvider from "./auth/AuthProvider";
import Courses from "./components/Courses";

function App() {
    return (
        <MemoryRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/courses" element={<Courses />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

export default App;