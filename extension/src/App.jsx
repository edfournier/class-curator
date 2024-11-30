import { MemoryRouter, Routes, Route } from "react-router-dom"; // Memory router since extensions don't have browser history
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";
import AuthProvider from "./auth/AuthProvider";
import Courses from "./components/Courses";
import Listener from "./components/Listener";

function App() {
    return (
        <MemoryRouter>
            <Listener>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/courses" element={<Courses />} />
                    </Routes>
                </AuthProvider>
            </Listener>
        </MemoryRouter>
    );
}

export default App;