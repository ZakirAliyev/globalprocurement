import './index.scss'
import {useTranslation} from 'react-i18next';
import {useLanguage} from "../../../context/LanguageContext/index.jsx";
import aze from "/public/assets/aze.png"
import {IoChevronDown} from "react-icons/io5";

const LanguageSwitcher = () => {
    const {language, changeLanguage} = useLanguage();
    const {t} = useTranslation();

    return (
        <section id={"languageSwitcher"}>
            {/*<h1>{t('welcome')}</h1>*/}
            {/*<p>Aktif Dil: {language}</p>*/}
            {/*<button onClick={() => changeLanguage('az')}>Azərbaycanca</button>*/}
            {/*<button onClick={() => changeLanguage('en')}>English</button>*/}
            {/*<button onClick={() => changeLanguage('ru')}>Русский</button>*/}
            <img src={aze} alt={"Aze"}/>
            <span>Az</span>
            <IoChevronDown/>
        </section>
    );
};

export default LanguageSwitcher;
