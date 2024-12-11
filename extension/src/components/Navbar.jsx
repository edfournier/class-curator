import { NavLink } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

/**
 * Creates a stylized link that redirects to the specified path
 */
function Link({ name, path }) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `pb-2 text-lg transition-colors ${
                    isActive ? "border-b-4 border-indigo-500 text-indigo-500" : "hover:text-indigo-500"
                }`
            }
        >
            {name}
        </NavLink>
    );
}

/**
 * Renders the application's navigation bar, with switching managed by React Router
 */
function Navbar() {
    const { user } = useAuth();

    return (
        <div className="fixed top-0 w-full bg-gray-900 px-4 py-2 shadow-md">
            <div className="flex items-center justify-between">
                <div className="space-x-6">
                    <Link name="Home" path="/home" />
                    <Link name="Friends" path="/friends" />
                    <Link name="Courses" path="/courses" />
                </div>
                <div className="relative">
                    <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full border-2 border-gray-700" />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
