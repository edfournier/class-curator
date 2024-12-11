import Navbar from "./Navbar";

/**
 * Defines the layout (e.g. top navbar) for pages
 */
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="mx-auto mt-12 max-w-4xl px-6 py-3">{children}</main>
        </>
    );
};

export default Layout;
