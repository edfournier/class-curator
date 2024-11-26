import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="bg-gray-900 text-white py-2 px-4 shadow-md w-full">
            <div className="flex justify-between items-center">
                <div className="space-x-6">
                    <Link to="/home" className="text-lg hover:text-indigo-500 transition-colors">
                        Home
                    </Link>
                    <Link to="/friends" className="text-lg hover:text-indigo-500 transition-colors">
                        Friends
                    </Link>
                    <Link to="/courses" className="text-lg hover:text-indigo-500 transition-colors">
                        Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;