import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/src/assets/ugurlu.png"
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";

function SuccessPage() {

    const {t} = useTranslation();

    return (
        <>
            <PageTop/>
            <section id={"successPage"}>
                <div className={"container"}>
                    <nav>
                        <img src={image1} alt={"Image"}/>
                        <h2>{t("success.title")}</h2>
                        <p>{t("success.description")}</p>
                    </nav>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default SuccessPage;
