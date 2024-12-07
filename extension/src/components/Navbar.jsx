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
                `text-lg transition-colors pb-2 ${
                    isActive
                        ? "text-indigo-500 border-b-4 border-indigo-500"
                        : "hover:text-indigo-500"
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
        <div className="bg-gray-900 py-2 px-4 shadow-md w-full">
            <div className="flex justify-between items-center">
                <div className="space-x-6">
                    <Link name="Home" path="/home" />
                    <Link name="Friends" path="/friends" />
                    <Link name="Courses" path="/courses" />
                </div>
                <div className="relative">
                    <img
                        src={user.picture}  
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-gray-700"
                    />
                </div>
            </div>
        </div>
    );
}

export default Navbar;