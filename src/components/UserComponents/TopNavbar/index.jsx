import {useEffect, useState} from "react";
import './index.scss';
import {useTranslation} from "react-i18next";
import {FaWhatsapp} from "react-icons/fa6";
import LanguageSwitcher from "../LanguageSwitcher/index.jsx";
import {LuMessageCircleQuestion} from "react-icons/lu";
import {FaInstagram} from "react-icons/fa";
import {BiLogoFacebook} from "react-icons/bi";
import {RiTwitterXFill} from "react-icons/ri";

function TopNavbar() {
    const {t} = useTranslation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id="topNavbar">
            <div className="container">
                <nav>
                    <div className="links">
                        <a href="https://wa.me/994507093929" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="link"/>
                        </a>
                        <div className="vertical"></div>
                        <a href="https://www.instagram.com/gpsazerbaijan" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="link"/>
                        </a>
                    </div>
                    <div className="number">
                        <LuMessageCircleQuestion/>
                        <a href="tel:+994507093929" className={"span"}>+994 (50) 709 39 29</a>
                    </div>
                    {!isMobile && <LanguageSwitcher/>}
                </nav>
            </div>
        </section>
    );
}

export default TopNavbar;
