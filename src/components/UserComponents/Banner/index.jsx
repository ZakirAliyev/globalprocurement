import './index.scss';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import "swiper/css";

import image1 from "/public/assets/banner1.png";
import image2 from "/public/assets/banner2.png";
import image3 from "/public/assets/banner3.png";
import image4 from "/public/assets/banner4.png";

function Banner() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <section id="banner">
            <div className="container">
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    style={{width: "100%", height: "100%"}}
                >
                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image1} alt="Banner"/>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image2} alt="Banner"/>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image3} alt="Banner"/>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image4} alt="Banner"/>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
}

export default Banner;
