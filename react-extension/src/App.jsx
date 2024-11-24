import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";
import AuthProvider from "./auth/AuthProvider";

function App() {
    return (
        <MemoryRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/friends" element={<Friends />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

export default App;