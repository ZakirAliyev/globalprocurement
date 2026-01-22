import { useTheme } from "../../../context/ThemeContext/index.jsx";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = () => {
    const { toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <button onClick={toggleTheme}>
            {t("themeSwitcher.toggle")}
        </button>
    );
};

export default ThemeSwitcher;
