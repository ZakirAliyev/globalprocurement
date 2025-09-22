import './index.scss'
import {useTranslation} from "react-i18next";
import clock from "/public/assets/clock.png";
import {useEffect, useState} from "react";
import {FaArrowRightLong} from "react-icons/fa6";
import endirim from "/public/assets/endirim.png"

function Title({text, type, discount}) {
    const {t} = useTranslation();
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
        <section id={"title"} style={{
            paddingTop: discount && '20px',
        }}>
            <div className={"container"}>
                <nav style={{
                    paddingLeft: isMobile && "0"
                }}>
                    <div className={"endirimWrapper"}>
                        {discount && (
                            <img src={endirim} alt={"Endirim"}/>
                        )}
                        <span>{text}</span>
                    </div>
                    <div className={"divWrapper"}>
                        {type === "discount" ? (
                            <>
                                <img src={clock} alt={"Clock"}/>
                                {!isMobile && (
                                    <div className={"offer"}>Həftənin təklifi :</div>
                                )}
                                <div className={"box"}>00h</div>
                                <div className={"box"}>23m</div>
                                <div className={"box"}>47s</div>
                            </>
                        ) : type === "most" ? (
                            <div className={"viewAll"}>
                                <span>Hamısına bax</span>
                                <FaArrowRightLong/>
                            </div>
                        ) : type === "new" && (
                            <div className={"viewAll"}>
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
