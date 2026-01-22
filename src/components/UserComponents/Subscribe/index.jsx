import "./index.scss";
import { useTranslation } from "react-i18next";
import facebook from "/public/assets/facebook.png";
import instagram from "/public/assets/instagram.png";
import whatsapp from "/public/assets/whatsapp.png";

function Subscribe() {
    const { t } = useTranslation();

    return (
        <section id="subscribe">
            <div className="container">
                <nav>
                    <div
                        className="row"
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="first">
                                {t("subscribe.title")}
                            </div>
                            <div className="second">
                                {t("subscribe.subtitle")}
                            </div>
                        </div>

                        <div style={{ padding: "0 8px" }}>
                            <img
                                className="icon"
                                src={facebook}
                                alt={t("subscribe.facebook")}
                                onClick={() =>
                                    (window.location.href =
                                        "https://www.facebook.com")
                                }
                            />
                            <img
                                className="icon"
                                src={instagram}
                                alt={t("subscribe.instagram")}
                                onClick={() =>
                                    (window.location.href =
                                        "https://www.instagram.com/globalservices.az/")
                                }
                            />
                            <img
                                className="icon"
                                src={whatsapp}
                                alt={t("subscribe.whatsapp")}
                                onClick={() =>
                                    (window.location.href =
                                        "https://wa.me/994507093929")
                                }
                            />
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Subscribe;
