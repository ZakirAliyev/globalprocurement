import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/kilid.png"
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";

function ForgotPasswordPage() {

    const {t} = useTranslation();

    return (
       <>
           <PageTop/>
           <section id={"forgotPasswordPage"}>
               <div className={"container"}>
                   <nav>
                       <div style={{
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "center",
                           alignItems: "center",
                       }}>
                           <img src={image1} alt={"Image"}/>
                           <h2>Şifrəni unutmusunuz?</h2>
                           <p>E-poçtunuzu daxil edin. Şifrəni sıfırlamaq üçün təsdiq linki sizə e-poçt vasitəsilə
                               göndəriləcək.</p>
                       </div>
                       <div style={{
                           display: "flex",
                           alignItems: "center",
                           flexDirection: "row",
                           gap: '8px',
                           marginTop: '32px',
                       }}>
                           <label>E-poçt</label>
                           <span className={"star"}> *</span>
                       </div>
                       <input placeholder={"E-poşçtunuzu daxil edin"}/>
                       <button>Giriş linkini göndər</button>
                   </nav>
               </div>
           </section>
           <PageBottom/>
       </>
    );
}

export default ForgotPasswordPage;