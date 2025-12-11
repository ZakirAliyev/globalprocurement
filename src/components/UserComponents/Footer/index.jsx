import './index.scss'
import {useTranslation} from "react-i18next";
import logo from "/public/assets/logo.png"
import {FaEnvelope, FaPhoneAlt} from "react-icons/fa";

function Footer() {

    const {t} = useTranslation();

    return (
        <section id={"footer"}>
            <div className={"container"}>
                <nav>
                    <div className={"row"}>
                        <div className={"col-8 col-md-8 col-sm-12 col-xs-12"}>
                            <img src={logo} alt={"Logo"}/>
                            <div className={"uzun"}>
                                Ev və tikinti üçün alət, material və aksesuarların tam çeşidi ilə peşəkar e-commerce
                                platforması.
                            </div>
                        </div>
                        {/*<div className={"col-3 col-md-3 col-sm-12 col-xs-12"}>*/}
                        {/*    <h4>Müştərilər üçün</h4>*/}
                        {/*    <p>Geri qaytarma siyasəti</p>*/}
                        {/*    <p>Ödəniş metodları</p>*/}
                        {/*    <p>Əlaqə</p>*/}
                        {/*    <p>Müştəri məmnuniyyəti anketi</p>*/}
                        {/*</div>*/}
                        <div className="col-4 col-md-4 col-sm-12 col-xs-12 contact-block">
                            <h4>Əlaqə məlumatları</h4>

                            <p className="contact-item">
                                <FaPhoneAlt />
                                <a href="tel:+994507093929">050 709 39 29 — Asim</a>
                            </p>

                            <p className="contact-item">
                                <FaEnvelope />
                                <a href="mailto:info@gpsazerbaijan.com">info@gpsazerbaijan.com</a>
                            </p>
                        </div>

                    </div>
                    <div className={"row box1"}>
                        <div className={"col-6 col-md-6 col-sm-12 col-xs-12 box2"}>
                            <span>© 2025 <span style={{
                                fontWeight: '600',
                            }}>Global Procurement Services.</span> Bütün hüquqlar qorunur.</span>
                        </div>
                        <div className={"col-6 col-md-6 col-sm-12 col-xs-12 box box2"}>
                            <span>Created by <span style={{
                                fontWeight: '600',
                                cursor: 'pointer',
                            }} onClick={()=> {
                                window.location.href = 'https://buyontech.net/'
                            }}>BuyonTech</span></span>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Footer;