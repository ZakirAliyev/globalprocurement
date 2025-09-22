import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/kilid.png"
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";

function ResetPasswordPage() {

    const {t} = useTranslation();

    return (
        <>
            <PageTop/>
            <section id={"resetPasswordPage"}>
                <div className={"container"}>
                    <nav>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <img src={image1} alt={"Image"}/>
                            <h2>Şifrənizi yeniləyin</h2>
                            <p>Hesabınıza giriş üçün yeni bir şifrə yaradın</p>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: '8px',
                            marginTop: '32px',
                        }}>
                            <label>Yeni şifrə</label>
                        </div>
                        <input placeholder={"Yeni şifrənizi daxil edin"}/>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: '8px',
                            marginTop: '8px',
                        }}>
                            <label>Yenidən daxil edin</label>
                        </div>
                        <input placeholder={"Yeni şifrənizi təkrar daxil edin"}/>
                        <button>Təsdiqlə</button>
                    </nav>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default ResetPasswordPage;