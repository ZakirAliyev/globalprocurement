import "./index.scss";
import { useTranslation } from "react-i18next";
import logo from "/public/assets/logo.png";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

function Footer() {
    const { t } = useTranslation();

    return (
        <section id="footer">
            <div className="container">
                <nav>
                    <div className="row">
                        <div className="col-8 col-md-8 col-sm-12 col-xs-12">
                            <img
                                src={logo}
                                alt={t("footer.logoAlt")}
                            />
                            <div className="uzun">
                                {t("footer.description")}
                            </div>
                        </div>

                        <div className="col-4 col-md-4 col-sm-12 col-xs-12 contact-block">
                            <h4>{t("footer.contactTitle")}</h4>

                            <p className="contact-item">
                                <FaPhoneAlt />
                                <a href="tel:+994507093929">
                                    {t("footer.phone")}
                                </a>
                            </p>

                            <p className="contact-item">
                                <FaEnvelope />
                                <a href="mailto:info@gpsazerbaijan.com">
                                    {t("footer.email")}
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="row box1">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 box2">
                            <span>
                                © 2025{" "}
                                <span style={{ fontWeight: "600" }}>
                                    {t("footer.company")}
                                </span>{" "}
                                {t("footer.rights")}
                            </span>
                        </div>

                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 box box2">
                            <span>
                                {t("footer.createdBy")}{" "}
                                <span
                                    style={{
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        window.location.href =
                                            "https://buyontech.net/";
                                    }}
                                >
                                    BuyonTech
                                </span>
                            </span>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Footer;
