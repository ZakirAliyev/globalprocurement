import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/yes.png"
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
                            <h2>Şifrə uğurla yeniləndi</h2>
                            <p>İndi yeni şifrənizlə hesabınıza daxil ola bilərsiniz.</p>
                        </div>
                        <button>Hesabına daxil ol</button>
                    </nav>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default PasswordSuccessPage;