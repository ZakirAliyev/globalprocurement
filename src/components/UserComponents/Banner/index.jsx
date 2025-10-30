import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/banner1.png"
import image2 from "/public/assets/banner2.png"
import image3 from "/public/assets/banner3.png"
import image4 from "/public/assets/banner4.png"
import {useNavigate} from "react-router";

function Banner() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <section id="banner">
            <div className="container">
                <div className="parent">
                    <div className="div1" onClick={()=>navigate('/discounts')} style={{
                        cursor: 'pointer',
                    }}>
                        <img src={image1} alt={"Banner"} className={"banner"}/>
                    </div>
                    <div className="div2">
                        <img src={image2} alt={"Banner"}/>
                    </div>
                    <div className="div3">
                        <img src={image3} alt={"Banner"}/>
                    </div>
                    <div className="div4">
                        <img src={image4} alt={"Banner"}/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner;