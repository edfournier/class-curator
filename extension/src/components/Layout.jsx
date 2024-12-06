import Navbar from "./Navbar";

/**
 * Defines the layout (e.g. top navbar) for pages
 */
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    );
};

export default Layout;