import Navbar from "./Navbar";

/**
 * Defines the layout (e.g. top navbar) for pages
 */
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-3 mt-12">
                {children}
            </main>
        </>
    );
};

export default Layout;