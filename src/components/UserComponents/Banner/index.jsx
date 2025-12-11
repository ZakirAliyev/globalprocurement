import './index.scss';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";   // 🔥 Autoplay modulunu əlavə et
import "swiper/css";

import image1 from "/public/assets/banner1.png";

function Banner() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section id="banner">
            <div className="container">
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 2000,      // 🔥 2 saniyədən bir keçid
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}   // 🔥 Swiper-ə Autoplay modulu əlavə olunur
                    style={{ width: "100%", height: "100%" }}
                >
                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image1} alt="Banner" />
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="banner-slide"
                            onClick={() => navigate('/discounts')}
                        >
                            <img src={image1} alt="Banner" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
}

export default Banner;
