import './index.scss'
import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import TopNavbar from "../../components/UserComponents/TopNavbar/index.jsx";
import Navbar from "../../components/UserComponents/Navbar/index.jsx";
import BottomNavbar from "../../components/UserComponents/BottomNavbar/index.jsx";
import Subscribe from "../../components/UserComponents/Subscribe/index.jsx";
import Footer from "../../components/UserComponents/Footer/index.jsx";
import ScrollToTop from "../../components/ScrollToTop/index.jsx";

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
            <div>
                <Outlet/>
                <ScrollToTop/>
            </div>
        </section>
    );
}

export default MainPage;