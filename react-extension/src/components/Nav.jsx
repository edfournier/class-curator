import { Link } from "react-router-dom";

function Nav() {
    return (
        <div>
            <Link to="/home">Home</Link>
            <Link to="/friends">Friends</Link>
        </div>
    );
}

export default Nav;