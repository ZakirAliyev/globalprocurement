import "./index.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation, Autoplay, Pagination} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/pagination';
import {useRef} from "react";

export default function InfiniteCarousel({ images = [] }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section id="infiniteCarousel">
            <Swiper
                modules={[Pagination, Autoplay]}
                loop={true}
                pagination={{
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                speed={500}
                slidesPerView={6}
                breakpoints={{
                    0: {
                        slidesPerView: 3,
                    },
                    500: {
                        slidesPerView: 6,
                    },
                }}
                className="carousel__swiper"
            >
                {images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <div className="carousel__item">
                            <img src={img} alt="" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
