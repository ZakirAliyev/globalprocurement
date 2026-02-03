import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/src/assets/yes.png"
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";

function PasswordSuccessPage() {

    const {t} = useTranslation();

    return (
        <>
            <PageTop/>
            <section id={"passwordSuccessPage"}>
                <div className={"container"}>
                    <nav>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}>
                            <img src={image1} alt={"Image"}/>
                            <h2>{t("passwordSuccess.title")}</h2>
                            <p>{t("passwordSuccess.description")}</p>
                        </div>
                        <button>{t("passwordSuccess.button")}</button>
                    </nav>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default PasswordSuccessPage;
