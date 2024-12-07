import { MemoryRouter, Routes, Route } from "react-router-dom"; // Memory router since extensions don't have browser history
import Login from "./pages/Login";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import Courses from "./pages/Courses";
import AuthProvider from "./providers/AuthProvider";
import Listener from "./components/Listener";
import Layout from "./components/Layout"

function App() {
    return (
        <MemoryRouter>
            <Listener>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Layout><Home /></Layout>} />
                        <Route path="/friends" element={<Layout><Friends /></Layout>} />
                        <Route path="/courses" element={<Layout><Courses /></Layout>} />
                    </Routes>
                </AuthProvider>
            </Listener>
        </MemoryRouter>
    );
}

export default App;