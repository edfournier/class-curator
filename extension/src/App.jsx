import { MemoryRouter, Routes, Route } from "react-router-dom"; // Memory router since extensions don't have browser history
import Login from "./pages/Login";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import Courses from "./pages/Courses";
import AuthProvider from "./providers/AuthProvider";
import Layout from "./components/Layout"
import AlertProvider from "./providers/AlertProvider";

function App() {
    return (
        <MemoryRouter>
            <AlertProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Layout><Home /></Layout>} />
                        <Route path="/friends" element={<Layout><Friends /></Layout>} />
                        <Route path="/courses" element={<Layout><Courses /></Layout>} />
                    </Routes>
                </AuthProvider>
            </AlertProvider>
        </MemoryRouter>
    );
}

export default App;