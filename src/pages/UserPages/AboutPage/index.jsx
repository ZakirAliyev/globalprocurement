import './index.scss';
import {MdChevronRight} from "react-icons/md";
import image1 from "/src/assets/worker.png"
import image2 from "/src/assets/drel.png"
import image4 from "/src/assets/birinci.png"
import image5 from "/src/assets/ikinci.png"
import image6 from "/src/assets/ucuncu.png"
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";
import {useTranslation} from "react-i18next";

function AboutPage() {

    const { t } = useTranslation();

    return (
        <>
            <PageTop/>
            <section id="aboutPage">
                <div className={"container"}>
                    <div className="navigation">
                        <div className="navText">{t("about.home")}</div>
                        <MdChevronRight className="navText"/>
                        <div className="selected navText">{t("about.title")}</div>
                    </div>

                    <div className={"pWrapper"}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: '16px'
                        }}>
                            <h2>
                                {t("about.title")}
                                <img src={image2} alt={"Image"} className={"xirda"}/>
                            </h2>
                            <p>
                                {t("about.description")}
                            </p>
                        </div>
                        <img src={image1} alt={"Image"} className={"worker"}/>
                    </div>

                    <div className={"services"}>
                        <div className={"title"}>{t("about.services.title")}</div>

                        <div className={"row boxWrapper"}>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image4} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>{t("about.services.service1.title")}</h2>
                                    <p>{t("about.services.service1.desc")}</p>
                                </div>
                            </div>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box box1"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image5} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>{t("about.services.service2.title")}</h2>
                                    <p>{t("about.services.service2.desc")}</p>
                                </div>
                            </div>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image6} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>{t("about.services.service3.title")}</h2>
                                    <p>{t("about.services.service3.desc")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"contact"}></div>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default AboutPage;
