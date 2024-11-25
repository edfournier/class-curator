import Navbar from "./Navbar";

/*
Can use this to get user profile, or just hit our own API
const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { "Authorization": `Bearer ${token}`}
});
const user = await res.json(); 
*/

function Home() {
    return (
        <>
            <Navbar />
            <div>Home</div>
        </>
    );
}

export default Home;
