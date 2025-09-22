import './index.scss';
import {MdChevronRight} from "react-icons/md";
import image1 from "/public/assets/worker.png"
import image2 from "/public/assets/drel.png"
import image4 from "/public/assets/birinci.png"
import image5 from "/public/assets/ikinci.png"
import image6 from "/public/assets/ucuncu.png"
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";

function AboutPage() {

    return (
        <>
            <PageTop/>
            <section id="aboutPage">
                <div className={"container"}>
                    <div className="navigation">
                        <div className="navText">Ana səhifə</div>
                        <MdChevronRight className="navText"/>
                        <div className="selected navText">Haqımızda</div>
                    </div>

                    <div className={"pWrapper"}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: '16px'
                        }}>
                            <h2>
                                Haqqımızda
                                <img src={image2} alt={"Image"} className={"xirda"}/>
                            </h2>
                            <p>
                                Biz keyfiyyətli təmir alətlərinin satışını həyata keçirən peşəkar bir komandayıq.
                                Məqsədimiz
                                həm
                                fərdi istifadəçilər, həm də peşəkar ustalar üçün etibarlı və uzunömürlü məhsullar təqdim
                                etməkdir. Saytımızda təqdim olunan hər bir alət, funksionallığı və davamlılığı ilə
                                seçilən
                                tanınmış markalardan seçilib. Müştəri məmnuniyyəti bizim üçün əsas prioritetdir və sizə
                                düzgün
                                seçim etməyinizdə kömək etməyə hər zaman hazırıq.
                            </p>
                        </div>
                        <img src={image1} alt={"Image"} className={"worker"}/>
                    </div>

                    <div className={"services"}>
                        <div className={"title"}>Xidmətlər</div>

                        <div className={"row boxWrapper"}>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image4} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>Keyfiyyətli Alət Satışı</h2>
                                    <p>Yüksək keyfiyyətli, uzunömürlü və peşəkar istifadə üçün uyğun təmir alətləri
                                        təqdim edirik.</p>
                                </div>
                            </div>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box box1"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image5} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>Peşəkar Məsləhət Xidməti</h2>
                                    <p>Ən uyğun aləti seçməyiniz üçün mütəxəssis komandamız sizə dəstək olur.</p>
                                </div>
                            </div>
                            <div className={"col-4 col-md-4 col-sm-12 col-xs-12"}>
                                <div className={"box"}>
                                    <div className={"boxWrapper1"}>
                                        <img src={image6} alt={"Image"} className={"image1"}/>
                                    </div>
                                    <h2>Sərfəli Qiymətlərlə Satış</h2>
                                    <p>Büdcənizə uyğun, keyfiyyət və qiymət balansını qoruyan alətlər təqdim edirik.</p>
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