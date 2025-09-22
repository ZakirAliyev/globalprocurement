import {useEffect, useState} from "react";
import TopNavbar from "../../components/UserComponents/TopNavbar/index.jsx";
import Navbar from "../../components/UserComponents/Navbar/index.jsx";
import BottomNavbar from "../../components/UserComponents/BottomNavbar/index.jsx";

function MainPage() {

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop >= 34);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id={"mainPage"}>
            <TopNavbar/>
            <div className={isSticky ? "navbar-wrapper sticky" : "navbar-wrapper"}>
                <Navbar/>
            </div>
            {isSticky && <div style={{height: "72px"}}></div>}
            <BottomNavbar/>
        </section>
    );
}

export default MainPage;