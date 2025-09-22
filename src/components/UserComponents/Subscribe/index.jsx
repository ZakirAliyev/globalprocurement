import './index.scss'
import {useTranslation} from "react-i18next";
import facebook from "/public/assets/facebook.png"
import instagram from "/public/assets/instagram.png"
import whatsapp from "/public/assets/whatsapp.png"
function Subscribe() {

    const {t} = useTranslation();

    return (
        <section id={"subscribe"}>
            <div className={"container"}>
                <nav>
                    <div className={"row"}>
                        <div className={"col-8 col-md-6 col-sm-12 col-xs-12"}>
                            <div className={"first"}>🔔 Xəbər bülleteninə abunə olun</div>
                            <div className={"second"}>Xəbər bülleteninə abunə olun, yeni fürsətləri qaçırtmayın!</div>
                            <div className={"inputWrapper"}>
                                <input/>
                                <button>Abunə ol</button>
                            </div>
                        </div>
                        <div className={"col-4 col-md-6 col-sm-12 col-xs-12"}>
                            <div className={"first"}>📢 Bizi sosial mediadan izləyin!</div>
                            <div className={"second"}>Sizin üçün paylaşırıq – bizə qoşulun! </div>
                            <img className={"icon"} src={facebook} alt={"Facebook"}/>
                            <img className={"icon"} src={instagram} alt={"Instagram"} />
                            <img className={"icon"} src={whatsapp} alt={"Whatsapp"} />
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Subscribe;