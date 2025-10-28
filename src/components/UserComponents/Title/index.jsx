import './index.scss';
import {useTranslation} from "react-i18next";
import clock from "/public/assets/clock.png";
import {useEffect, useState} from "react";
import {FaArrowRightLong} from "react-icons/fa6";
import endirim from "/public/assets/endirim.png";
import {useNavigate} from "react-router-dom";

function Title({text, type, discount, navigatePath}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [timeLeft, setTimeLeft] = useState({hours: 0, minutes: 0, seconds: 0});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🕒 3 günlük period (72 saatlıq gerisayım)
    useEffect(() => {
        const getCycleStart = () => {
            const now = new Date();
            const cycleLengthMs = 3 * 24 * 60 * 60 * 1000; // 3 gün
            const startTimestamp = Math.floor(now.getTime() / cycleLengthMs) * cycleLengthMs;
            return new Date(startTimestamp);
        };

        const updateCountdown = () => {
            const now = new Date();
            const cycleStart = getCycleStart();
            const cycleEnd = new Date(cycleStart.getTime() + 3 * 24 * 60 * 60 * 1000);
            const diff = cycleEnd - now;

            if (diff <= 0) {
                setTimeLeft({hours: 0, minutes: 0, seconds: 0});
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({hours, minutes, seconds});
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (value) => value.toString().padStart(2, "0");

    const handleNavigate = () => {
        switch (type) {
            case "discount":
                navigate("/discounts");
                break;
            case "most":
                navigate("/great-offers");
                break;
            case "best":
                navigate("/best-seller");
                break;
            case "new":
                navigate("/new-products");
                break;
            default:
                if (navigatePath) navigate(navigatePath);
                break;
        }
    };

    return (
        <section id="title" style={{paddingTop: discount && "20px"}}>
            <div className="container">
                <nav style={{paddingLeft: isMobile && "0"}}>
                    <div className="endirimWrapper">
                        {discount && <img src={endirim} alt="Endirim"/>}
                        <span>{text}</span>
                    </div>

                    <div className="divWrapper">
                        {type === "discount" ? (
                            <>
                                <img src={clock} alt="Clock"/>
                                {!isMobile && <div className="offer">Həftəlik təklif :</div>}
                                <div className="box">{formatTime(timeLeft.hours)}h</div>
                                <div className="box">{formatTime(timeLeft.minutes)}m</div>
                                <div className="box">{formatTime(timeLeft.seconds)}s</div>
                            </>
                        ) : (type === "most" || type === "new" || type === "best") && (
                            <div className="viewAll" onClick={handleNavigate}>
                                <span>Hamısına bax</span>
                                <FaArrowRightLong/>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Title;
