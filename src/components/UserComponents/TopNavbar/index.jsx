import { useEffect, useState } from "react";
import './index.scss';
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa6";
import LanguageSwitcher from "../LanguageSwitcher/index.jsx";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { BiLogoFacebook } from "react-icons/bi";
import { RiTwitterXFill } from "react-icons/ri";

function TopNavbar() {
    const { t } = useTranslation();
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
                        <FaWhatsapp className="link" />
                        <div className="vertical"></div>
                        <FaInstagram className="link" />
                        <div className="vertical"></div>
                        <BiLogoFacebook className="link" />
                        <div className="vertical"></div>
                        <RiTwitterXFill className="link" />
                    </div>
                    <div className="number">
                        <LuMessageCircleQuestion />
                        <span>(+994) 55 381 00 01</span>
                    </div>
                    {!isMobile && <LanguageSwitcher />}
                </nav>
            </div>
        </section>
    );
}

export default TopNavbar;
