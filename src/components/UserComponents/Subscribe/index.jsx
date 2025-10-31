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
                    <div className={"row"} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                            <div className={"first"}>📢 Bizi sosial mediadan izləyin!</div>
                            <div className={"second"}>Sizin üçün paylaşırıq – bizə qoşulun! </div>
                        </div>

                        <div style={{
                            padding: "0 8px",
                        }}>
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