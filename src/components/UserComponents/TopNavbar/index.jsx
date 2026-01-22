import { useEffect, useState } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa6";
import LanguageSwitcher from "../LanguageSwitcher";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";

function TopNavbar() {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section id="topNavbar">
            <div className="container">
                <nav>
                    <div className="links">
                        <a
                            href="https://wa.me/994507093929"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("topNavbar.whatsapp")}
                        >
                            <FaWhatsapp className="link" />
                        </a>

                        <div className="vertical"></div>

                        <a
                            href="https://www.instagram.com/globalservices.az"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("topNavbar.instagram")}
                        >
                            <FaInstagram className="link" />
                        </a>
                    </div>

                    <div className="number">
                        <LuMessageCircleQuestion />
                        <a href="tel:+994507093929" className="span">
                            {t("topNavbar.phone")}
                        </a>
                    </div>

                    <LanguageSwitcher />
                </nav>
            </div>
        </section>
    );
}

export default TopNavbar;
