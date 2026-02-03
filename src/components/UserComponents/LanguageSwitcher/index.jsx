import "./index.scss";
import { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import aze from "/src/assets/aze.png";
import eng from "/src/assets/eng.png";
import rus from "/src/assets/rus.png";
import { IoChevronDown } from "react-icons/io5";

const LANGUAGES = {
    az: { label: "AZ", image: aze },
    en: { label: "EN", image: eng },
    ru: { label: "RU", image: rus },
};

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const [open, setOpen] = useState(false);

    const current = LANGUAGES[language];

    return (
        <div
            id="languageSwitcher"
            onClick={() => setOpen(!open)}
        >
            <img src={current.image} alt={current.label} />
            <span>{current.label}</span>
            <IoChevronDown className={open ? "rotate" : ""} />

            {open && (
                <div className="dropdown">
                    {Object.entries(LANGUAGES).map(([key, value]) => (
                        key !== language && (
                            <div
                                key={key}
                                className="item"
                                onClick={() => changeLanguage(key)}
                            >
                                <img src={value.image} alt={value.label} />
                                <span>{value.label}</span>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
