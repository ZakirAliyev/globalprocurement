import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/src/assets/failed.png"

function FailedPage() {

    const {t} = useTranslation();

    return (
        <section id={"failedPage"}>
            <div className={"container"}>
                <nav>
                    <img src={image1} alt={"Image"}/>
                    <h2>{t("failed.title")}</h2>
                    <p>{t("failed.description")}</p>
                </nav>
            </div>
        </section>
    );
}

export default FailedPage;
