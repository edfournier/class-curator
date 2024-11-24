import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";

function App() {
    return (
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/friends" element={<Friends />} />
            </Routes>
        </MemoryRouter>
    );
}

export default App;