import './index.scss'
import {useTranslation} from "react-i18next";
import logo from "/public/assets/logo.png"

function Footer() {

    const {t} = useTranslation();

    return (
        <section id={"footer"}>
            <div className={"container"}>
                <nav>
                    <div className={"row"}>
                        <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                            <img src={logo} alt={"Logo"}/>
                            <div className={"uzun"}>
                                Ev və tikinti üçün alət, material və aksesuarların tam çeşidi ilə peşəkar e-commerce
                                platforması.
                            </div>
                        </div>
                        <div className={"col-3 col-md-3 col-sm-12 col-xs-12"}>
                            <h4>Müştərilər üçün</h4>
                            <p>Geri qaytarma siyasəti</p>
                            <p>Ödəniş metodları</p>
                            <p>Əlaqə</p>
                            <p>Müştəri məmnuniyyəti anketi</p>
                        </div>
                        <div className={"col-3 col-md-3 col-sm-12 col-xs-12"}>
                            <h4>Əlaqə məlumatları</h4>
                            <p>+994 70 654 34 98</p>
                            <p>globalprocurement@gmail.com</p>
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